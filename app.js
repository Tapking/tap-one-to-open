/* =====================================================
   OPEN THE BOX
   VERSION 3.0
===================================================== */


/* =====================================================
   عناصر
===================================================== */

const board =
    document.getElementById("board");

const scrollArea =
    document.getElementById("scrollArea");

const editorModal =
    document.getElementById("editorModal");

const editorItems =
    document.getElementById("editorItems");

const settingsModal =
    document.getElementById("settingsModal");

const randomModal =
    document.getElementById("randomModal");

const randomNumber =
    document.getElementById("randomNumber");

const openedCount =
    document.getElementById("openedCount");

const totalCount =
    document.getElementById("totalCount");

const statusText =
    document.getElementById("statusText");

const mainTitle =
    document.getElementById("mainTitle");

const brandTitle =
    document.getElementById("brandTitle");

const backgroundLayer =
    document.getElementById(
        "backgroundLayer"
    );

const toast =
    document.getElementById("toast");


/* =====================================================
   تنظیمات
===================================================== */

let settings = {

    title:
        "Tap one to open",

    brand:
        "OPEN THE BOX",

    theme:
        "wood",

    background:
        "sky",

    numberColor:
        "#111111",

    numberSize:
        65,

    imageSize:
        75,

    animation:
        "flip",

    sound:
        "on",

    cardHeight:
        190,

    gap:
        22

};


/* =====================================================
   تعداد خانه
===================================================== */

let boxCount =
    15;


/* =====================================================
   اطلاعات خانه‌ها
===================================================== */

let boxes = [];


/* =====================================================
   خانه‌های باز
===================================================== */

let opened =
    new Set();


/* =====================================================
   ساخت خانه‌های اولیه
===================================================== */

function createDefaultBoxes() {

    boxes = [];


    const names = [

        "Cristiano Ronaldo",
        "Lionel Messi",
        "Kylian Mbappe",
        "Erling Haaland",
        "Neymar",

        "Brazil",
        "Argentina",
        "France",
        "Portugal",
        "England",

        "Real Madrid",
        "Barcelona",
        "Manchester City",
        "Liverpool",
        "Bayern Munich"

    ];


    for (
        let i = 0;
        i < boxCount;
        i++
    ) {

        boxes.push({

            title:
                names[i] ||
                `گزینه ${i + 1}`,

            description:
                "",

            image:
                null,

            imageName:
                "",

            type:
                "player"

        });

    }

}


createDefaultBoxes();


/* =====================================================
   Escape HTML
===================================================== */

function escapeHTML(value) {

    return String(
        value ?? ""
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =====================================================
   Toast
===================================================== */

let toastTimer = null;


function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/* =====================================================
   اطمینان از وجود خانه‌ها
===================================================== */

function ensureBoxCount() {

    while (
        boxes.length <
        boxCount
    ) {

        boxes.push({

            title:
                `گزینه ${
                    boxes.length + 1
                }`,

            description:
                "",

            image:
                null,

            imageName:
                "",

            type:
                "other"

        });

    }


    if (
        boxes.length >
        boxCount
    ) {

        boxes =
            boxes.slice(
                0,
                boxCount
            );

    }

}


/* =====================================================
   ساخت Board
===================================================== */

function renderBoard() {

    ensureBoxCount();


    board.innerHTML =
        "";


    board.style.setProperty(
        "--card-height",
        `${settings.cardHeight}px`
    );


    board.style.setProperty(
        "--card-gap",
        `${settings.gap}px`
    );


    totalCount.textContent =
        boxCount;


    for (
        let i = 0;
        i < boxCount;
        i++
    ) {

        const data =
            boxes[i];


        const tile =
            document.createElement(
                "div"
            );


        tile.className =
            "tile";


        tile.dataset.index =
            i;


        if (
            opened.has(i)
        ) {

            tile.classList.add(
                "open"
            );

        }


        let imageContent = "";


        if (
            data.image
        ) {

            imageContent = `

                <img
                    class="reveal-image"
                    src="${data.image}"
                    style="
                        width:${settings.imageSize}%;
                    "
                    alt=""
                >

            `;

        }

        else {

            imageContent = `

                <div class="no-image">
                    ⚽
                </div>

            `;

        }


        let description =
            "";


        if (
            data.description
        ) {

            description = `

                <div
                    class="reveal-description"
                >
                    ${escapeHTML(
                        data.description
                    )}
                </div>

            `;

        }


        tile.innerHTML = `

            <div class="card">

                <div class="face front">

                    <div
                        class="number-paper"
                        style="
                            color:${settings.numberColor};
                            font-size:${settings.numberSize}px;
                        "
                    >

                        ${i + 1}

                    </div>

                </div>


                <div class="face back">

                    ${imageContent}

                    <div class="reveal-title">

                        ${escapeHTML(
                            data.title ||
                            "بدون عنوان"
                        )}

                    </div>

                    ${description}

                </div>

            </div>

        `;


        tile.addEventListener(
            "click",
            () => {

                openBox(
                    i,
                    tile
                );

            }
        );


        board.appendChild(
            tile
        );

    }


    updateStatus();

}


/* =====================================================
   باز کردن خانه
===================================================== */

function openBox(
    index,
    tile = null
) {

    if (
        opened.has(index)
    ) {

        return;

    }


    opened.add(
        index
    );


    if (!tile) {

        tile =
            board.children[index];

    }


    if (tile) {

        tile.classList.add(
            "open"
        );

    }


    playOpenSound();


    const data =
        boxes[index];


    statusText.textContent =
        `خانه ${index + 1}: ${
            data?.title ||
            "بدون عنوان"
        }`;


    updateStatus();


    /*
       کمی اسکرول می‌کنیم تا خانه انتخاب شده
       اگر پایین صفحه باشد بهتر دیده شود.
    */

    setTimeout(
        () => {

            if (
                tile &&
                tile.scrollIntoView
            ) {

                tile.scrollIntoView({
                    behavior:
                        "smooth",

                    block:
                        "nearest"

                });

            }

        },
        100
    );

}


/* =====================================================
   وضعیت
===================================================== */

function updateStatus() {

    openedCount.textContent =
        opened.size;


    totalCount.textContent =
        boxCount;


    if (
        opened.size === 0
    ) {

        statusText.textContent =
            "یک خانه را انتخاب کن";

    }


    if (
        opened.size === boxCount &&
        boxCount > 0
    ) {

        statusText.textContent =
            "همه خانه‌ها باز شدند 🎉";

    }

}


/* =====================================================
   تغییر تعداد
===================================================== */

document
    .querySelectorAll(
        ".count-button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const count =
                        Number(
                            button.dataset.count
                        );


                    if (
                        !count
                    ) {

                        return;

                    }


                    setBoxCount(
                        count
                    );


                    document
                        .querySelectorAll(
                            ".count-button"
                        )
                        .forEach(
                            item => {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );

                }
            );

        }
    );


function setBoxCount(count) {

    if (
        count < 1 ||
        count > 100
    ) {

        return;

    }


    boxCount =
        count;


    ensureBoxCount();


    opened.clear();


    renderBoard();


    scrollArea.scrollTo({
        top:
            0,

        behavior:
            "smooth"

    });


    showToast(
        `${count} خانه آماده شد`
    );

}


/* =====================================================
   تعداد دلخواه
===================================================== */

document
    .getElementById(
        "customCountButton"
    )
    .addEventListener(
        "click",
        () => {

            const value =
                prompt(
                    "تعداد خانه را بین 1 تا 100 وارد کن:",
                    boxCount
                );


            if (
                value === null
            ) {

                return;

            }


            const count =
                Number(value);


            if (
                !Number.isInteger(count) ||
                count < 1 ||
                count > 100
            ) {

                alert(
                    "تعداد باید بین 1 تا 100 باشد."
                );

                return;

            }


            setBoxCount(
                count
            );

        }
    );


/* =====================================================
   Editor
===================================================== */

document
    .getElementById(
        "editButton"
    )
    .addEventListener(
        "click",
        openEditor
    );


function openEditor() {

    ensureBoxCount();


    editorItems.innerHTML =
        "";


    for (
        let i = 0;
        i < boxCount;
        i++
    ) {

        const data =
            boxes[i];


        const item =
            document.createElement(
                "div"
            );


        item.className =
            "editor-item";


        item.dataset.index =
            i;


        const image =
            data.image
                ? `
                    <img
                        src="${data.image}"
                        alt=""
                    >
                  `
                : `
                    <div
                        class="image-placeholder"
                    >
                        ⚽
                    </div>
                  `;


        item.innerHTML = `

            <div class="editor-number">

                خانه ${i + 1}

            </div>


            <div class="image-preview">

                ${image}

            </div>


            <div class="image-buttons">

                <button
                    class="choose-image"
                    type="button"
                >
                    🖼️ عکس
                </button>


                <button
                    class="remove-image"
                    type="button"
                >
                    🗑️ حذف
                </button>

            </div>


            <label>

                عنوان

                <input
                    class="box-title"
                    type="text"
                    value="${escapeHTML(
                        data.title
                    )}"
                >

            </label>


            <label>

                توضیح

                <textarea
                    class="box-description"
                >${escapeHTML(
                    data.description
                )}</textarea>

            </label>


            <label>

                نوع

                <select
                    class="box-type"
                >

                    <option
                        value="player"
                        ${
                            data.type ===
                            "player"
                                ? "selected"
                                : ""
                        }
                    >
                        بازیکن
                    </option>

                    <option
                        value="country"
                        ${
                            data.type ===
                            "country"
                                ? "selected"
                                : ""
                        }
                    >
                        کشور
                    </option>

                    <option
                        value="team"
                        ${
                            data.type ===
                            "team"
                                ? "selected"
                                : ""
                        }
                    >
                        تیم
                    </option>

                    <option
                        value="other"
                        ${
                            data.type ===
                            "other"
                                ? "selected"
                                : ""
                        }
                    >
                        سایر
                    </option>

                </select>

            </label>

        `;


        item
            .querySelector(
                ".choose-image"
            )
            .addEventListener(
                "click",
                async () => {

                    const result =
                        await window
                            .appAPI
                            .selectImage();


                    if (!result) {

                        return;

                    }


                    boxes[i].image =
                        result.data;


                    boxes[i].imageName =
                        result.name;


                    item.querySelector(
                        ".image-preview"
                    ).innerHTML = `

                        <img
                            src="${result.data}"
                            alt=""
                        >

                    `;

                }
            );


        item
            .querySelector(
                ".remove-image"
            )
            .addEventListener(
                "click",
                () => {

                    boxes[i].image =
                        null;


                    boxes[i].imageName =
                        "";


                    item.querySelector(
                        ".image-preview"
                    ).innerHTML = `

                        <div
                            class="image-placeholder"
                        >
                            ⚽
                        </div>

                    `;

                }
            );


        editorItems.appendChild(
            item
        );

    }


    editorModal.classList.remove(
        "hidden"
    );

}


/* =====================================================
   ذخیره ادیتور
===================================================== */

document
    .getElementById(
        "saveEditorButton"
    )
    .addEventListener(
        "click",
        saveEditor
    );


function saveEditor() {

    const items =
        editorItems.querySelectorAll(
            ".editor-item"
        );


    items.forEach(
        item => {

            const index =
                Number(
                    item.dataset.index
                );


            boxes[index].title =
                item
                    .querySelector(
                        ".box-title"
                    )
                    .value
                    .trim();


            boxes[index].description =
                item
                    .querySelector(
                        ".box-description"
                    )
                    .value
                    .trim();


            boxes[index].type =
                item
                    .querySelector(
                        ".box-type"
                    )
                    .value;

        }
    );


    opened.clear();


    editorModal.classList.add(
        "hidden"
    );


    renderBoard();


    showToast(
        "تغییرات ذخیره شد"
    );

}


/* =====================================================
   بستن ادیتور
===================================================== */

document
    .getElementById(
        "closeEditor"
    )
    .addEventListener(
        "click",
        closeEditor
    );


document
    .getElementById(
        "cancelEditorButton"
    )
    .addEventListener(
        "click",
        closeEditor
    );


function closeEditor() {

    editorModal.classList.add(
        "hidden"
    );

}


/* =====================================================
   حذف همه عکس‌ها
===================================================== */

document
    .getElementById(
        "clearImagesButton"
    )
    .addEventListener(
        "click",
        () => {

            if (
                !confirm(
                    "عکس تمام خانه‌ها حذف شود؟"
                )
            ) {

                return;

            }


            boxes.forEach(
                box => {

                    box.image =
                        null;

                    box.imageName =
                        "";

                }
            );


            openEditor();

        }
    );


/* =====================================================
   حذف متن‌ها
===================================================== */

document
    .getElementById(
        "clearTextsButton"
    )
    .addEventListener(
        "click",
        () => {

            if (
                !confirm(
                    "متن تمام خانه‌ها پاک شود؟"
                )
            ) {

                return;

            }


            boxes.forEach(
                box => {

                    box.title =
                        "";

                    box.description =
                        "";

                }
            );


            openEditor();

        }
    );


/* =====================================================
   انتخاب تصادفی
===================================================== */

document
    .getElementById(
        "randomButton"
    )
    .addEventListener(
        "click",
        randomSelect
    );


function randomSelect() {

    const available = [];


    for (
        let i = 0;
        i < boxCount;
        i++
    ) {

        if (
            !opened.has(i)
        ) {

            available.push(i);

        }

    }


    if (
        available.length === 0
    ) {

        showToast(
            "همه خانه‌ها باز شده‌اند."
        );

        return;

    }


    randomModal.classList.remove(
        "hidden"
    );


    let ticks =
        0;


    const animation =
        setInterval(
            () => {

                const number =
                    available[
                        Math.floor(
                            Math.random() *
                            available.length
                        )
                    ];


                randomNumber.textContent =
                    number + 1;


                playClickSound();


                ticks++;


                if (
                    ticks >= 28
                ) {

                    clearInterval(
                        animation
                    );


                    const finalIndex =
                        available[
                            Math.floor(
                                Math.random() *
                                available.length
                            )
                        ];


                    randomNumber.textContent =
                        finalIndex + 1;


                    setTimeout(
                        () => {

                            randomModal.classList.add(
                                "hidden"
                            );


                            const tile =
                                board.children[
                                    finalIndex
                                ];


                            openBox(
                                finalIndex,
                                tile
                            );

                        },
                        700
                    );

                }

            },
            60
        );

}


/* =====================================================
   Shuffle
===================================================== */

document
    .getElementById(
        "shuffleButton"
    )
    .addEventListener(
        "click",
        () => {

            for (
                let i =
                    boxes.length - 1;
                i > 0;
                i--
            ) {

                const j =
                    Math.floor(
                        Math.random() *
                        (i + 1)
                    );


                [
                    boxes[i],
                    boxes[j]
                ] = [
                    boxes[j],
                    boxes[i]
                ];

            }


            opened.clear();


            renderBoard();


            showToast(
                "گزینه‌ها مخلوط شدند 🔀"
            );

        }
    );


/* =====================================================
   Reset
===================================================== */

document
    .getElementById(
        "resetButton"
    )
    .addEventListener(
        "click",
        () => {

            opened.clear();


            renderBoard();


            scrollArea.scrollTo({
                top:
                    0,

                behavior:
                    "smooth"

            });


            showToast(
                "خانه‌ها ریست شدند"
            );

        }
    );


/* =====================================================
   باز کردن همه
===================================================== */

document
    .getElementById(
        "openAllButton"
    )
    .addEventListener(
        "click",
        () => {

            for (
                let i = 0;
                i < boxCount;
                i++
            ) {

                opened.add(i);

            }


            renderBoard();


            showToast(
                "همه خانه‌ها باز شدند"
            );

        }
    );


/* =====================================================
   بستن همه
===================================================== */

document
    .getElementById(
        "closeAllButton"
    )
    .addEventListener(
        "click",
        () => {

            opened.clear();


            renderBoard();


            showToast(
                "همه خانه‌ها بسته شدند"
            );

        }
    );


/* =====================================================
   ذخیره پروژه
===================================================== */

document
    .getElementById(
        "saveButton"
    )
    .addEventListener(
        "click",
        async () => {

            const project = {

                app:
                    "Open The Box",

                version:
                    "3.0",

                created:
                    new Date().toISOString(),

                boxCount:
                    boxCount,

                boxes:
                    boxes,

                settings:
                    settings

            };


            const success =
                await window
                    .appAPI
                    .saveProject(
                        project
                    );


            if (
                success
            ) {

                showToast(
                    "پروژه ذخیره شد 💾"
                );

            }

        }
    );


/* =====================================================
   باز کردن پروژه
===================================================== */

document
    .getElementById(
        "loadButton"
    )
    .addEventListener(
        "click",
        async () => {

            const project =
                await window
                    .appAPI
                    .loadProject();


            if (!project) {

                return;

            }


            if (
                Number.isInteger(
                    project.boxCount
                )
            ) {

                boxCount =
                    Math.min(
                        100,
                        Math.max(
                            1,
                            project.boxCount
                        )
                    );

            }


            if (
                Array.isArray(
                    project.boxes
                )
            ) {

                boxes =
                    project.boxes;

            }


            if (
                project.settings
            ) {

                settings =
                    {
                        ...settings,
                        ...project.settings
                    };

            }

        
            ensureBoxCount();


            opened.clear();


            applySettingsToUI();


            applySettings();


            renderBoard();


            scrollArea.scrollTo({
                top:
                    0,

                behavior:
                    "smooth"

            });


            showToast(
                "پروژه باز شد 📂"
            );

        }
    );


/* =====================================================
   تمام صفحه
===================================================== */

document
    .getElementById(
        "fullscreenButton"
    )
    .addEventListener(
        "click",
        async () => {

            await window
                .appAPI
                .toggleFullscreen();

        }
    );


/* =====================================================
   Settings
===================================================== */

document
    .getElementById(
        "settingsButton"
    )
    .addEventListener(
        "click",
        () => {

            applySettingsToUI();


            settingsModal.classList.remove(
                "hidden"
            );

        }
    );


document
    .getElementById(
        "closeSettings"
    )
    .addEventListener(
        "click",
        () => {

            settingsModal.classList.add(
                "hidden"
            );

        }
    );


/* =====================================================
   اعمال تنظیمات
===================================================== */

document
    .getElementById(
        "applySettings"
    )
    .addEventListener(
        "click",
        () => {

            settings.title =
                document
                    .getElementById(
                        "titleInput"
                    )
                    .value;


            settings.brand =
                document
                    .getElementById(
                        "brandInput"
                    )
                    .value;


            settings.numberColor =
                document
                    .getElementById(
                        "numberColorInput"
                    )
                    .value;


            settings.numberSize =
                Number(
                    document
                        .getElementById(
                            "numberSizeInput"
                        )
                        .value
                );


            settings.imageSize =
                Number(
                    document
                        .getElementById(
                            "imageSizeInput"
                        )
                        .value
                );


            settings.animation =
                document
                    .getElementById(
                        "animationSelect"
                    )
                    .value;


            settings.sound =
                document
                    .getElementById(
                        "soundSelect"
                    )
                    .value;


            settings.background =
                document
                    .getElementById(
                        "backgroundSelect"
                    )
                    .value;


            settings.cardHeight =
                Number(
                    document
                        .getElementById(
                            "cardHeightInput"
                        )
                        .value
                );


            settings.gap =
                Number(
                    document
                        .getElementById(
                            "gapInput"
                        )
                        .value
                );


            applySettings();


            settingsModal.classList.add(
                "hidden"
            );


            showToast(
                "تنظیمات اعمال شد ⚙️"
            );

        }
    );


/* =====================================================
   اعمال Settings
===================================================== */

function applySettings() {

    mainTitle.textContent =
        settings.title;


    brandTitle.textContent =
        settings.brand;


    document.body.className =
        settings.theme;


    backgroundLayer.className =
        "background-layer";


    if (
        settings.background ===
        "dark"
    ) {

        backgroundLayer.classList.add(
            "background-dark"
        );

    }


    if (
        settings.background ===
        "stadium"
    ) {

        backgroundLayer.classList.add(
            "background-stadium"
        );

    }


    if (
        settings.background ===
        "gradient"
    ) {

        backgroundLayer.classList.add(
            "background-gradient"
        );

    }


    board.style.setProperty(
        "--card-height",
        `${settings.cardHeight}px`
    );


    board.style.setProperty(
        "--card-gap",
        `${settings.gap}px`
    );


    renderBoard();

}


/* =====================================================
   UI تنظیمات
===================================================== */

function applySettingsToUI() {

    document
        .getElementById(
            "titleInput"
        )
        .value =
        settings.title;


    document
        .getElementById(
            "brandInput"
        )
        .value =
        settings.brand;


    document
        .getElementById(
            "numberColorInput"
        )
        .value =
        settings.numberColor;


    document
        .getElementById(
            "numberSizeInput"
        )
        .value =
        settings.numberSize;


    document
        .getElementById(
            "imageSizeInput"
        )
        .value =
        settings.imageSize;


    document
        .getElementById(
            "animationSelect"
        )
        .value =
        settings.animation;


    document
        .getElementById(
            "soundSelect"
        )
        .value =
        settings.sound;


    document
        .getElementById(
            "backgroundSelect"
        )
        .value =
        settings.background;


    document
        .getElementById(
            "cardHeightInput"
        )
        .value =
        settings.cardHeight;


    document
        .getElementById(
            "gapInput"
        )
        .value =
        settings.gap;


    document
        .getElementById(
            "themeSelect"
        )
        .value =
        settings.theme;

}


/* =====================================================
   Theme
===================================================== */

document
    .getElementById(
        "themeSelect"
    )
    .addEventListener(
        "change",
        event => {

            settings.theme =
                event.target.value;


            applySettings();

        }
    );


/* =====================================================
   صدا
===================================================== */

let audioContext =
    null;


function getAudioContext() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }


    return audioContext;

}


function playTone(
    frequency,
    duration,
    volume
) {

    if (
        settings.sound ===
        "off"
    ) {

        return;

    }


    try {

        const ctx =
            getAudioContext();


        const oscillator =
            ctx.createOscillator();


        const gain =
            ctx.createGain();


        oscillator.type =
            "sine";


        oscillator.frequency.value =
            frequency;


        gain.gain.value =
            volume;


        oscillator.connect(
            gain
        );


        gain.connect(
            ctx.destination
        );


        oscillator.start();


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            ctx.currentTime +
            duration
        );


        oscillator.stop(
            ctx.currentTime +
            duration
        );

    }

    catch (error) {

        console.log(
            "Audio error:",
            error
        );

    }

}


function playClickSound() {

    playTone(
        500,
        0.05,
        0.04
    );

}


function playOpenSound() {

    playTone(
        300,
        0.08,
        0.05
    );


    setTimeout(
        () => {

            playTone(
                700,
                0.15,
                0.06
            );

        },
        80
    );

}


/* =====================================================
   میانبرها
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        /* F11 */

        if (
            event.key ===
            "F11"
        ) {

            event.preventDefault();


            window
                .appAPI
                .toggleFullscreen();

        }


        /* R = random */

        if (
            event.key.toLowerCase() ===
            "r"
        ) {

            randomSelect();

        }


        /* Escape */

        if (
            event.key ===
            "Escape"
        ) {

            editorModal.classList.add(
                "hidden"
            );


            settingsModal.classList.add(
                "hidden"
            );


            randomModal.classList.add(
                "hidden"
            );

        }

    }
);


/* =====================================================
   ذخیره خودکار تنظیمات در LocalStorage
===================================================== */

function autoSaveSettings() {

    try {

        localStorage.setItem(
            "openTheBoxSettings",
            JSON.stringify(
                settings
            )
        );

    }

    catch (error) {

    }

}


function loadAutoSettings() {

    try {

        const saved =
            localStorage.getItem(
                "openTheBoxSettings"
            );


        if (saved) {

            const parsed =
                JSON.parse(saved);


            settings =
                {
                    ...settings,
                    ...parsed
                };

        }

    }

    catch (error) {

    }

}


setInterval(
    autoSaveSettings,
    5000
);


/* =====================================================
   جلوگیری از اسکرول عجیب با Wheel
===================================================== */

scrollArea.addEventListener(
    "wheel",
    event => {

        /*
           فقط برای اطمینان از اینکه
           اسکرول روی خود صفحه انجام شود.
        */

        if (
            Math.abs(
                event.deltaY
            ) >
            Math.abs(
                event.deltaX
            )
        ) {

            scrollArea.scrollTop +=
                event.deltaY;

        }

    },
    {
        passive:
            false
    }
);


/* =====================================================
   شروع برنامه
===================================================== */

loadAutoSettings();

applySettingsToUI();

applySettings();

renderBoard();

showToast(
    "Open The Box آماده است ⚽"
);