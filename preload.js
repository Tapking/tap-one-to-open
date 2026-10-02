const {
    contextBridge,
    ipcRenderer
} = require("electron");


contextBridge.exposeInMainWorld(
    "appAPI",
    {

        /* انتخاب عکس */

        selectImage:
            () =>
                ipcRenderer.invoke(
                    "select-image"
                ),


        /* ذخیره */

        saveProject:
            project =>
                ipcRenderer.invoke(
                    "save-project",
                    project
                ),


        /* باز کردن */

        loadProject:
            () =>
                ipcRenderer.invoke(
                    "load-project"
                ),


        /* تمام صفحه */

        toggleFullscreen:
            () =>
                ipcRenderer.invoke(
                    "toggle-fullscreen"
                ),


        isFullscreen:
            () =>
                ipcRenderer.invoke(
                    "is-fullscreen"
                ),


        /* خروج */

        quit:
            () =>
                ipcRenderer.invoke(
                    "quit-app"
                )

    }
);