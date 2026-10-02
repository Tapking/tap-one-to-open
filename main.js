const {
    app,
    BrowserWindow,
    dialog,
    ipcMain
} = require("electron");

const path = require("path");
const fs = require("fs");

let mainWindow = null;


/* =========================================
   ساخت پنجره
========================================= */

function createWindow() {

    mainWindow = new BrowserWindow({

        width: 1440,
        height: 900,

        minWidth: 900,
        minHeight: 600,

        title:
            "Open The Box Football",

        backgroundColor:
            "#65bde8",

        autoHideMenuBar:
            true,

        webPreferences: {

            preload:
                path.join(
                    __dirname,
                    "preload.js"
                ),

            contextIsolation:
                true,

            nodeIntegration:
                false,

            sandbox:
                false

        }

    });


    mainWindow.loadFile(
        path.join(
            __dirname,
            "index.html"
        )
    );

}


/* =========================================
   برنامه آماده شد
========================================= */

app.whenReady().then(() => {

    createWindow();


    app.on(
        "activate",
        () => {

            if (
                BrowserWindow
                    .getAllWindows()
                    .length === 0
            ) {

                createWindow();

            }

        }
    );

});


/* =========================================
   بستن برنامه
========================================= */

app.on(
    "window-all-closed",
    () => {

        if (
            process.platform !==
            "darwin"
        ) {

            app.quit();

        }

    }
);


/* =========================================
   انتخاب عکس
========================================= */

ipcMain.handle(
    "select-image",
    async () => {

        if (!mainWindow) {

            return null;

        }


        const result =
            await dialog.showOpenDialog(
                mainWindow,
                {

                    title:
                        "انتخاب عکس",

                    properties: [
                        "openFile"
                    ],

                    filters: [

                        {
                            name:
                                "تصاویر",

                            extensions: [
                                "jpg",
                                "jpeg",
                                "png",
                                "webp",
                                "gif"
                            ]

                        }

                    ]

                }
            );


        if (
            result.canceled ||
            result.filePaths.length === 0
        ) {

            return null;

        }


        const filePath =
            result.filePaths[0];


        try {

            const extension =
                path
                    .extname(
                        filePath
                    )
                    .toLowerCase();


            let mime =
                "image/png";


            if (
                extension === ".jpg" ||
                extension === ".jpeg"
            ) {

                mime =
                    "image/jpeg";

            }


            if (
                extension === ".webp"
            ) {

                mime =
                    "image/webp";

            }


            if (
                extension === ".gif"
            ) {

                mime =
                    "image/gif";

            }


            const buffer =
                fs.readFileSync(
                    filePath
                );


            return {

                name:
                    path.basename(
                        filePath
                    ),

                data:
                    `data:${mime};base64,${buffer.toString("base64")}`

            };

        }

        catch (error) {

            return null;

        }

    }
);


/* =========================================
   ذخیره پروژه
========================================= */

ipcMain.handle(
    "save-project",
    async (
        event,
        project
    ) => {

        if (!mainWindow) {

            return false;

        }


        const result =
            await dialog.showSaveDialog(
                mainWindow,
                {

                    title:
                        "ذخیره پروژه",

                    defaultPath:
                        "open-the-box-project.json",

                    filters: [

                        {
                            name:
                                "Open The Box Project",

                            extensions: [
                                "json"
                            ]

                        }

                    ]

                }
            );


        if (
            result.canceled ||
            !result.filePath
        ) {

            return false;

        }


        try {

            fs.writeFileSync(

                result.filePath,

                JSON.stringify(
                    project,
                    null,
                    2
                ),

                "utf8"

            );


            return true;

        }

        catch (error) {

            console.error(error);

            return false;

        }

    }
);


/* =========================================
   باز کردن پروژه
========================================= */

ipcMain.handle(
    "load-project",
    async () => {

        if (!mainWindow) {

            return null;

        }


        const result =
            await dialog.showOpenDialog(
                mainWindow,
                {

                    title:
                        "باز کردن پروژه",

                    properties: [
                        "openFile"
                    ],

                    filters: [

                        {
                            name:
                                "Open The Box Project",

                            extensions: [
                                "json"
                            ]

                        }

                    ]

                }
            );


        if (
            result.canceled ||
            result.filePaths.length === 0
        ) {

            return null;

        }


        try {

            const text =
                fs.readFileSync(
                    result.filePaths[0],
                    "utf8"
                );


            return JSON.parse(
                text
            );

        }

        catch (error) {

            console.error(error);

            return null;

        }

    }
);


/* =========================================
   تمام صفحه
========================================= */

ipcMain.handle(
    "toggle-fullscreen",
    () => {

        if (!mainWindow) {

            return false;

        }


        const next =
            !mainWindow.isFullScreen();


        mainWindow.setFullScreen(
            next
        );


        return next;

    }
);


/* =========================================
   وضعیت تمام صفحه
========================================= */

ipcMain.handle(
    "is-fullscreen",
    () => {

        if (!mainWindow) {

            return false;

        }


        return mainWindow.isFullScreen();

    }
);


/* =========================================
   خروج
========================================= */

ipcMain.handle(
    "quit-app",
    () => {

        app.quit();

    }
);