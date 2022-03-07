const storeEndpoint: string = "https://www.goodreads.com/choiceawards/best-books-2020";
const amazonSearchEndpoint: string = "https://www.amazon.com/s?i=stripbooks-intl-ship&k=";
let amazonTabId: number;

interface Genre {
  genreId: number;
  genreName: string;
  bookList: Array<string>;
}

interface BrowserMessage {
  type: string;
  message: string;
}

function init() {
  chrome.runtime.onMessage.addListener((message, sender) => {
    if ((message as BrowserMessage).type === 'ERROR_OCCURED') {
      //chrome.windows.remove(sender.tab.windowId);
      showError("Error while processing order");
      console.log((message as BrowserMessage).message);
    }
  });

  document.addEventListener('DOMContentLoaded', async () => {
    showLoading();
    let genreList = await fetchBooks();
    appendGenreList(genreList);
    registerEventListeners(genreList);
    hideLoading();
  }, false);
}

let showLoading = () => {
  document.getElementById("loading").style.display = "flex";
  document.getElementById("main").style.display = "none";
}

let hideLoading = () => {
  document.getElementById("loading").style.display = "none";
  document.getElementById("main").style.display = "block";
}

let showError = (message: string) => {
  hideLoading();
  document.getElementById("error").style.visibility = "visible";
  document.getElementById("error").innerText = message;
}

let hideError = () => {
  document.getElementById("error").style.visibility = "hidden";
  document.getElementById("error").innerText = "";
}

let fetchBooks = async (): Promise<Array<Genre>> => {
  try {
    let response = await fetch(storeEndpoint);
    let data = await response.text();
    var parser = new DOMParser();
    var doc = parser.parseFromString(data, "text/html");
    let genreList: Array<Genre> = [];

    doc.querySelectorAll(".category")
      .forEach((s, index) => {
        genreList[index] = {
          genreId: index,
          genreName: parser.parseFromString(s.querySelector(".category__copy").innerHTML, "text/html").documentElement.textContent,
          bookList: [(s.querySelector(".category__winnerImage") as HTMLImageElement).alt]
        };
      });

    return genreList;
  } catch (err) {
    showError("Error while fetching books");
    console.log(err);
  }
};

let appendGenreList = (genreList: Array<Genre>) => {
  try {
    var genreSelect = document.getElementById("genre-list") as HTMLSelectElement;
    genreList.forEach((item, index) => {
      var option = document.createElement("option");
      option.text = item.genreName;
      option.value = item.genreId.toString();
      genreSelect.add(option);
    });
  } catch (err) {
    console.log("Error while appending genre list to DOM");
    console.log(err);
  }
}

let registerEventListeners = (genreList: Array<Genre>) => {
  try {
    document.querySelector("#genre-list").addEventListener("change", hideError);
    document.querySelector("form").addEventListener("submit", (event) => handleAddToCartButtonClick(event, genreList));
  } catch (err) {
    showError("Error occured while registering event listeners");
    console.log(err);
  }
};

let handleAddToCartButtonClick = async (event: SubmitEvent, genreList: Array<Genre>) => {
  try {
    event.preventDefault();
    hideError();
    showLoading();
    let genreId = Number((document.getElementById("genre-list") as HTMLSelectElement).value);
    let bookName = genreList[genreId].bookList[0];

    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      if (tabId == amazonTabId && changeInfo.status == "complete")
        chrome.tabs.executeScript(tabId, {
          file: "amazon.js"
        });
    })

    chrome.windows.create({ url: amazonSearchEndpoint + bookName, type: "popup", state: "minimized" }, (window) => {
      amazonTabId = window.tabs[0].id;
    });
  } catch (err) {
    showError("Error occured while adding item to the cart");
    console.log(err);
  }
}

init();
