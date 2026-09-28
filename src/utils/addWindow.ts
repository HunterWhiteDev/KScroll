import Column from "../Column";
import toalWidth from "./getTotalWidth";
import removeWindow from "./removeWindow";

import updatePager from "./updatePager";
const padding = 8;

function handleMinimizedChange(window: KWin.AbstractClient) {
  if (window.minimized) removeWindow(window);
  else addWindow(window);
}

const excludeList = [
  "org.kde.plasmashell",
  "krunner",
  "org.kde.spectacle",
  "plasmashell",
  "",
  "xdg-desktop-portal-kde",
];

export default function addWindow(newWindow: KWin.AbstractClient) {
  if (!newWindow) return;
  if (
    excludeList.includes(newWindow.resourceName) ||
    excludeList.includes(newWindow.resourceClass)
  )
    return;
  if (!newWindow.resourceName || !newWindow.resourceClass) return;
  if (!newWindow.normalWindow) return;
  if (newWindow.skipSwitcher) return;
  if (newWindow.transient) return;
  if (!newWindow.resizeable) return;
  if (
    newWindow.frameGeometry.width === 0 ||
    newWindow.frameGeometry.height === 0
  )
    return;

  //Premptive check to make sure somehow addWindow() is not called on a window already in the grid

  const columns = workspace.__globals.getColumnsSortedByXPos();

  //Sometimes, kwin likes to call the windowAdded() signal twice for the same window, especially when opening a minimized window from krunner. This nested loop ensures that we only ever add a window once to the grid.
  for (const col of columns) {
    for (const win of col.windows) {
      if (win.internalId === newWindow.internalId) return;
    }
  }

  let newWindowXPos;
  if (!columns.length) {
    newWindowXPos = newWindow.frameGeometry.x;
  } else {
    const lastColumn = columns[columns.length - 1];

    newWindowXPos = lastColumn.getXPosEnd();
  }

  const newColumn = new Column(newWindow, padding, newWindowXPos);
  workspace.__globals.grid.columns.push(newColumn);

  const monitorWidth = toalWidth();
  const columnXPosEnd = newColumn.getXPosEnd();
  if (columnXPosEnd > monitorWidth) {
    const difference = Math.abs(columnXPosEnd - monitorWidth);

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      column.setXPos(column.xPosStart - difference);
    }

    //For some reason, the correct geometry was not applying on init unless this is called
    newColumn.maximize();
  }

  newWindow.minimizedChanged.connect(() => handleMinimizedChange(newWindow));

  updatePager();
}
