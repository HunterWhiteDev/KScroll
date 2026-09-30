export default function updatePager() {
  const columns = workspace.__globals.getColumnsSortedByXPos();

  let data = [];
  for (const column of columns) {
    data.push({
      colId: column.id,
      xPosStart: column.xPosStart,
      windows: column.windows.map((window: KWin.AbstractClient) => {
        return {
          resourceName: window.resourceName || "",
          resourceClass: window.resourceClass || "",
          desktopFileName: window.desktopFileName || "",
          caption: window.caption || "",
          active: window.active || false,
        };
      }),
      xPosEnd: column.getXPosEnd(),
    });
  }

  callDBus(
    "dev.hunterwhite.pager",
    "/change",
    "dev.hunterwhite.pager",
    "pass",
    JSON.stringify({ data }),
  );
}
