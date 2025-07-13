async function downloadMedia(url, filename, extension) {
  try {
    //ref : https://stackoverflow.com/questions/3916191/download-data-url-file
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename + "." + extension;
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);
      })
      .catch(console.error);
  } catch (error) {
    console.error("Download failed:", error);
  }
}

setInterval(() => {
  const media = document.querySelector(
    "div[data-test-id='closeup-visual-container']"
  );

  if (media) {
    const keys = Object.keys(media);
    const reactFiberKey = keys[0];
    const component = media[reactFiberKey];

    const videos = component.memoizedProps?.children?.props?.pin?.videos;
    const images = component.memoizedProps?.children?.props?.pin?.images;

    const userName =
      component.memoizedProps?.children?.props?.pin?.origin_pinner?.username ||
      component.memoizedProps?.children?.props?.pin?.pinner?.username;

    const mediaId = component.memoizedProps?.children?.props?.pin?.id;

    let savedMedia;
    if (videos && videos.length != 0) {
      const videoUrl = videos.video_list.V_720P.url;

      savedMedia = {
        url: videoUrl,
        username: userName,
        mediaId: mediaId,
        extension: "mp4",
      };
    } else if (images && images.length != 0) {
      const imageUrl = images.orig.url;

      savedMedia = {
        url: imageUrl,
        username: userName,
        mediaId: mediaId,
        extension: "jpg",
      };
    }

    const reactDeck = document.querySelector(
      "div[data-test-id='closeup-action-items'"
    );
    const downloadBtn = reactDeck?.querySelector("button#download-button");

    if (reactDeck && !downloadBtn) {
      // 버튼을 생성합니다.
      const downloadButton = document.createElement("button");
      downloadButton.id = "download-button"; // 버튼에 ID를 추가하여 나중에 쉽게 찾을 수 있습니다.
      downloadButton.textContent = "Download";
      downloadButton.style.margin = "10px"; // 버튼에 스타일 추가 (선택 사항)
      downloadButton.onclick = function () {
        const mediaUrl = savedMedia.url;
        const username = savedMedia.username;
        const mediaId = savedMedia.mediaId;
        const extension = savedMedia.extension;

        const filename = username + "-" + Date.now() + "-" + mediaId;

        downloadMedia(mediaUrl, filename, extension);
      };

      // 생성한 버튼을 지정한 요소에 추가합니다.
      reactDeck.appendChild(downloadButton);
    }
  }
}, 1000);
