import "kwin-types";
import Column from "./Column";
import Grid from "./Grid";

export declare global {
  // declare const getColumnWithActiveWindow = () => [Column, index];
  namespace KWin {
    interface QtScriptWorkspaceWrapper {
      __globals: {
        autoFocus: boolean;
        getColumnWithActiveWindow: () => [Column, index] | null;
        getColumnsSortedByXPos(): Column[];
        getTotalWidth(): number;
        getColumnWithWindow(window: KWin.AbstractClient): Column | null;
        removeColumnAtIndex(index: number);
        grid: Grid;
        padding: number;
        floatingIds: Set<QUuid>;
      };
      stackingOrder: KWin.AbstractClient[];
      activeScreen: Output;
      activeWindow: KWin.AbstractClient;
      screens: Output[];
      windowAdded: Signal<(window: KWin.AbstractClient) => void>;
      windowActivated: Signal<(window: KWin.AbstractClient) => void>;
      windowRemoved: Signal<(window: KWin.AbstractClient) => void>;
      currentDesktop: VirtualDesktop;
    }

    interface AbstractClient {
      resourceName: string;
      resourceClass: string;
      output: KWin.AbstractClient;
      interactiveMoveResizeStarted: Signal<() => void>;
      interactiveMoveResizeStepped: Signal<() => void>;
      interactiveMoveResizeFinished: Signal<() => void>;
      floating: boolean;
    }

    interface Output {
      geometry: QRect;
      devicePixelRatio: number;
      name: string;
      manufacturer: string;
      model: string;
      serialNumber: string;
    }
  }
}

export {};
