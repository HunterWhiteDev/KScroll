import { focusLeft, focusRight } from "./focus";
import { shiftViewLeft, shiftViewRight } from "./shiftView";
import { maxSpace } from "./maxSpace";
import { moveToLeftColumn, moveToRightColumn } from "./moveToColumn";
import { increaseWidth, decreaseWidth } from "./changeWidth";
import { swapLeft, swapRight } from "./swapColumn";
import { floatWindow } from "./floatWindow";
import updatePager from "../utils/updatePager";

export const initShortcuts = () => {
  registerShortcut(
    "Move current window to the left column",
    "",
    "Meta+G",
    moveToLeftColumn,
  );
  registerShortcut(
    "Move current window to the right column",
    "",
    "Meta+H",
    moveToRightColumn,
  );

  registerShortcut("Increase Width", "", "Meta+E", increaseWidth);
  registerShortcut("Decrease Width", "", "Meta+W", decreaseWidth);

  registerShortcut(
    "Focus left",
    "Focuses the next window to the left",
    "Meta+A",
    focusLeft,
  );

  registerShortcut(
    "Focus right",
    "Focuses the next window to the right",
    "Meta+D",
    focusRight,
  );
  registerShortcut(
    "Take up max space",
    "Makes the active column take up the maximum amount of space possible. This is normally your available space minus your padding",
    "Meta+M",
    maxSpace,
  );

  registerShortcut(
    "Swap The Current Column with its Column to the left",
    "",
    "Meta+Ctrl+A",
    swapLeft,
  );

  registerShortcut(
    "Swap The Current Column with its Column to the right",
    "",
    "Meta+Ctrl+D",
    swapRight,
  );

  registerShortcut(
    "Scroll Viewport Left",
    "Scrolls the view port by the width of the column to the left without focusing the column",
    "Meta+Shift+A",
    shiftViewLeft,
  );

  registerShortcut(
    "Scroll Viewport Right",
    "Scrolls the view port by the width of the column to the right without focusing the column",
    "Meta+Shift+D",
    shiftViewRight,
  );
  registerShortcut(
    "Toggle Floating",
    "Toggles Floating a window",
    "Meta+X",
    floatWindow,
  );

  registerShortcut("Debug", "", "Meta+M", updatePager);
};
