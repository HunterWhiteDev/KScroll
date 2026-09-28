import Column from "../Column";
import updatePager from "./updatePager";

export default function removeWindow(
  removedWindow: KWin.AbstractClient,
  focusNextWindow = true,
) {
  const columnWithWindow =
    workspace.__globals.getColumnWithWindow(removedWindow);
  if (!columnWithWindow) return;
  const columns = workspace.__globals.getColumnsSortedByXPos();

  let removedColumnIdx = 0;
  let found = false;
  const newColumns = columns.filter((col, idx) => {
    //Compares memory addres so should work fine. It's possible giving each column a UUID will be a better solution in the future
    if (col === columnWithWindow) {
      removedColumnIdx = idx;
      found = true;

      if (removedColumnIdx === columns.length - 1) {
        const nextColumnToFocus = columns[idx - 1];

        //If the column that is removed is the last one in thne row, we want to focus the last window in the column to the left

        if (focusNextWindow) {
          const nextWindowToFocus =
            nextColumnToFocus.windows[nextColumnToFocus.windows.length - 1];
          workspace.activeWindow = nextWindowToFocus;
        }
      }

      return;
    }

    //Found needs to be true, because if we only check if idx > removedColumnIdx, this will be true before we actually find the column we need
    if (idx > removedColumnIdx && found) {
      col.setXPos(col.xPosStart - columns[removedColumnIdx + 1].width);
    }

    //As long as we didnt reach the condition where we are removing the last column, focus the window to the right
    if (idx === removedColumnIdx + 1 && focusNextWindow) {
      workspace.activeWindow = col.windows[0];
    }

    return col;
  });

  workspace.__globals.grid.columns = newColumns as Column[];

  updatePager();
}
