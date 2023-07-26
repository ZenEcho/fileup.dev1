// 洗牌算法
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

//对比筛选
function filterDataByIndex(data, indexList) {
    return indexList.map(index => data[index]);
}

// 自定义DATA
const urlParams = new URLSearchParams(window.location.search);
const dataParamValue = urlParams.get('data');
let fetchURL
if (dataParamValue) {
    fetchURL = "https://cors-anywhere.pnglog.com/" + decodeURIComponent(dataParamValue);

} else {
    fetchURL = "https://fileup.dev/imgtestData.json"
}
fetch(fetchURL)
    .then(response => response.text())
    .then(res => {
        let jsonObject, data
        let $box = $('#box');
        let countdown = 3;  // 倒计时函数
        const currentPage = 1;   // 页面加载时生成HTML
        if (dataParamValue) {
            console.log(res)
        }
        try {
            jsonObject = JSON.parse(res);
            data = jsonObject.data;
        } catch (error) {
            console.error('Error parsing data:', error);
            $('#box').after(`
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">👇错误👇</h4>
                    <hr>
                    <p>`+ error + `</p>
                    <hr>
                    <p class="mb-0">👆错误信息👆</p>
                </div>
                `)
            return;
        }

        // 生成HTML的函数
        function generateHTML(Data) {
            $box.empty()
            const itemsPerPage = 6;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            let currentData
            if (!Data) {
                currentData = data.slice(startIndex, endIndex);
            } else {
                currentData = Data
            }
            currentData.forEach(item => {
                // 创建并附加图片元素
                const $newImage = $(`
                  <div class="box">
                    <h3><a href="${item.link}" target="_blank">${item.name}</a></h3>
                    <p style="font-size: 0.9em;">${item.introduce}</p>
                    <div class="image"></div>
                    <div class="loading"></div>
                    <p class="text-center row" style="font-size: 0.9em;">
                        <span class="loadingTime col" style="color: #dc3545;">加载时间:1秒</span><span class="imageSize col" style="color: #198754;">图片大小:0.00MB</span>
                    </p>
                  </div>
                `);
                if (item.CDN == 1) {
                    $newImage.append(`
                    <span class="ISCDN"><svg t="1690359899816" class="icon" viewBox="0 0 1033 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="2437" width="1.75rem" height="1.75rem">
                    <path d="M512 512m-499.2 0a499.2 499.2 0 1 0 998.4 0 499.2 499.2 0 1 0-998.4 0Z" fill="#1989FA"
                        fill-opacity=".3" p-id="2438"></path>
                    <path
                        d="M13.4144 536.8832A507.4816 507.4816 0 0 1 12.8 512C12.8 236.288 236.288 12.8 512 12.8c134.464 0 256.512 53.1584 346.2656 139.6096-7.1936 13.1328-18.2528 22.8992-28.5696 31.7056-17.1392 14.656-21.12-14.6432-34.3808-62.9888s-113.792-20.736-113.792 0 90.2272 29.6064-2.5984 79.296c-27.84 14.8992-65.1136 16.2176-87.8464 27.648-12.1344 6.0928-6.528 44.1856-14.6176 59.3152-6.272 11.776-26.8288 2.4064-31.68 0-24.8192-12.288-7.8336-80.9472-27.1104-86.9632-26.3168-8.2304-50.2784 27.4304-50.2784 40.64 0 15.0656 22.464 94.72 0 151.0784-24.8832 62.4256-104.5504 120.7936-156.2624 110.2976-98.4064-19.968-122.4448-48.4608-143.7184-19.968-21.2864 28.4928 12.9664 94.976 37.5552 135.6544 24.576 40.6656 2.56 92.2624-24.5888 92.2624-36.544 0-79.7824-46.6816-102.8096-92.2624-11.4048-22.5664-32.7936-49.664-64.1536-81.2416z m466.3936 246.7456c55.8336-38.3232 121.7664-60.6976 185.28-38.3232 63.488 22.3616 85.376 158.2976 31.616 200.0256-53.76 41.728-106.112 14.1696-128.7296 0-22.6176-14.1824-155.9936 14.1696-177.984 0-21.9904-14.1824-45.824-44.0832-45.824-99.776 0-55.68 79.808-23.616 135.6416-61.9264z m-171.392-146.7136c12.288-25.4208 40.64 7.168 57.3056-39.68 16.6656-46.8736 31.616-56.6784 49.344-26.5984 17.7408 30.08 13.376 62.7968 0 82.5344-13.376 19.7248-12.7872 15.5008-48.768 15.5008-35.968 0-70.1952-6.336-57.8944-31.7568zM473.0112 435.2c13.0176 1.3824 19.52 5.824 19.52 13.3504 0 11.2768-9.7536 26.9056-9.7536 26.9056s-27.1616 15.2576-33.28 8.704c-6.0928-6.528 8.1664-22.272 8.1664-35.6096 0-8.896 5.12-13.3504 15.36-13.3504z m24.6016 206.3488c28.9536-16.0512 51.7632-18.6368 68.4032-7.744 24.96 16.3456 87.2448 28.9024 87.2448 36.4928v25.0368c-51.9296-2.9824-85.248-11.328-99.9424-25.0368-22.0416-20.5568-66.9312 9.0368-66.9312 0 0-6.016 3.7376-15.6032 11.2256-28.7488z"
                        fill="#1989FA" p-id="2439"></path>
                </svg></span>`)
                }
                // 将当前创建的图片元素附加到 $box

                $box.append($newImage);

                const img = new Image();
                img.src = item.image + "?cache=$" + Date.now();
                const startTime = Date.now();

                img.onload = function () {
                    $newImage.find(".loading").remove()
                    // 获取图片宽度和高度
                    $newImage.find(".image").append(img);
                    const endTime = Date.now();
                    let loadTime = endTime - startTime;
                    let time;
                    if (loadTime > 1000) {
                        loadTime = loadTime / 1000
                        time = "秒"
                    } else {
                        time = "毫秒"
                    }
                    $newImage.find(".loadingTime").text(`加载时间:${loadTime}${time}`)
                };
                img.onerror = function () {
                    $newImage.find(".loading").remove()
                    $newImage.find(".loadingTime").text(`图片加载失败`)
                    $newImage.append(`
                    <div class="alert alert-danger" role="alert">
                        图片加载失败
                    </div>
                    `);
                };

                const xhr = new XMLHttpRequest();
                xhr.open('HEAD', "https://cors-anywhere.pnglog.com/" + item.image, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        // 获取图片的文件大小
                        const contentLength = xhr.getResponseHeader('Content-Length');
                        const fileSizeInBytes = parseInt(contentLength, 10);
                        const fileSizeInKB = fileSizeInBytes / 1024;
                        let fileSizeInMB = (fileSizeInKB / 1024 || 0).toFixed(2);
                        $newImage.find(".imageSize").text(`图片大小:${fileSizeInMB}MB`)
                    }
                };
                xhr.send();
            });

        }

        // 随机洗牌数组
        shuffleArray(data);

        function startCountdown() {
            const countdownInterval = setInterval(() => {
                $box.empty().text(`等待：${countdown}秒`);
                countdown--;
                if (countdown < 0) {
                    clearInterval(countdownInterval);
                    generateHTML();

                    let dataBox = $(`.dataBox`)
                    let select = []
                    data.forEach((item, index) => {
                        let html = $(`<div style="margin: 10px; padding: 10px;" class="shadow">
                            <span >"${item.name}"</span>
                        </div>`)
                        dataBox.append(html);

                        html.click(function () {
                            $(this).toggleClass("Boxactiv");
                            if ($(this).hasClass("Boxactiv")) {
                                $(".select").append(`<span index="${index}" style=" border: 1px solid; margin:10px; padding: 5px; ">"${item.name}"</span>`);
                                select.push(index)
                            } else {
                                $(".select").find(`span:contains("${item.name}")`).remove();
                                const removeIndex = select.indexOf(index);
                                if (removeIndex !== -1) {
                                    // 使用 splice 方法删除该索引
                                    select.splice(removeIndex, 1);
                                }
                            }
                        });
                    })
                    $("#contrast").click(() => {
                        const filteredData = filterDataByIndex(data, select);
                        $("#box").removeClass("count1 count2 count3");
                        if (filteredData.length != 0) {
                            generateHTML(filteredData);
                        }
                        // 根据 filteredData.length 来设置 class 的值
                        if (filteredData.length >= 1 && filteredData.length <= 3) {
                            $("#box").addClass(`count${filteredData.length}`);
                        } else if (filteredData.length > 3) {
                            $("#box").addClass("count3");
                        }
                    });
                }
            }, 1000);
        }

        // 开始倒计时
        startCountdown();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });




