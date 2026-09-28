import updatePager from "../utils/updatePager";
import addWindow from "../utils/addWindow";
import removeWindow from "../utils/removeWindow";

export const floatWindow = () => {
  //If no activeWindow, immedietely return
  if (!workspace.activeWindow) return;
  print("did not return");

  //Get the column with the active window
  const columnResponse = workspace.__globals.getColumnWithActiveWindow();

  //If no columnResponse, windnow is not in a grid, so add it back
  if (!columnResponse) {
    workspace.activeWindow["floating"] = false;
    addWindow(workspace.activeWindow);
    return;
  } else {
    workspace.activeWindow["floating"] = true;
    removeWindow(workspace.activeWindow, false);
  }

  // //Remove the window so it will no longer be managed by KScroll
  // col.windows.forEach((win) => print(win.caption));
  // col.windows = col.windows.filter((win) => {
  //   if (win === workspace.activeWindow) {
  //     win.interactiveMoveResizeFinished.disconnect;
  //     return false;
  //   } else {
  //     return true;
  //   }
  // });
  //
  // //If no windows are left, we need to remove the column from the grid.
  // if (col.windows.length === 0) {
  //   workspace.__globals.grid.columns = workspace.__globals.grid.columns.filter(
  //     (column) => column !== col,
  //   );
  // } else {
  //   //Otherwise, we just need to call maximize on the column
  //   col.maximize();
  // }
  updatePager();
};
