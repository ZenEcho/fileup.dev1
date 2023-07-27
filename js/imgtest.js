function initializePopovers() {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    popoverTriggerList.forEach(popoverTriggerEl => {
        new bootstrap.Popover(popoverTriggerEl);
    });
}

// 洗牌算法
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

//对比筛选
function filterDataByIndex(Data, indexList) {
    return indexList.map(index => Data[index]);
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
                        <span class="loadingTime col" style="color: #dc3545;">加载时间:</span><span class="imageSize col" style="color: #198754;">图片大小:0.00MB</span>
                    </p>
                    <span class="IsIcons">
                        <span class="isCDN" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="CDN"></span>
                        <span class="isCN" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="海外"></span>
                    </span>
                  </div>
                `);
                if (item.CDN === 1) {
                    // CDN
                    $newImage.find(".isCDN").append(`
                    <svg t="1690366162444" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5066" width="32" height="32"><path d="M793.088 150.016c14.848 0 29.696 2.048 43.52 6.656 7.168 2.048 13.824 5.12 20.48 8.704s12.8 7.168 18.944 11.776c11.776 9.216 20.992 19.968 27.648 31.232 6.144 10.752 10.24 23.04 11.264 35.84 1.024 12.288-1.024 25.088-5.632 36.352-5.12 12.288-13.312 23.552-23.552 32.256-5.632 4.608-11.264 9.216-17.92 12.8-6.144 3.584-13.312 6.656-19.968 9.216-7.168 2.56-14.336 4.096-21.504 5.632-11.264 2.048-22.016 2.048-33.28 1.536-10.752-1.024-21.504-3.072-31.744-6.144L665.6 418.816c6.656 10.752 11.776 21.504 15.36 33.28 7.168 23.04 7.168 47.616 0.512 70.656-3.584 12.288-8.704 23.552-15.36 34.304l102.4 87.552c11.776-4.608 24.576-7.68 37.376-8.704 12.288-1.024 24.576-0.512 36.864 1.536 16.384 2.56 31.744 8.192 46.08 16.384 7.168 4.096 14.336 8.704 20.48 14.336 12.288 10.24 23.04 23.04 30.208 37.376 7.168 13.824 11.264 28.16 12.288 43.008s-1.024 29.696-6.144 43.52c-5.632 14.848-14.336 28.16-25.6 38.912-6.144 5.632-12.288 10.752-19.456 15.36-7.168 4.608-14.336 8.192-22.016 10.752-7.68 3.072-15.872 5.12-23.552 6.656-33.28 5.632-68.096-0.512-97.28-17.408-7.68-4.608-14.336-9.728-20.992-15.36-10.24-9.216-18.944-19.456-25.6-31.744-6.144-10.752-10.752-23.04-12.8-35.328-2.048-11.776-2.048-24.064-0.512-36.352 2.048-11.776 6.144-23.552 12.288-34.304l-98.304-85.504c-7.168 4.096-14.336 7.68-22.016 10.752s-15.36 5.632-23.04 7.68c-15.872 4.096-32.256 6.144-48.128 6.144-13.824 0-27.136-1.536-40.96-4.096-13.312-3.072-26.112-7.168-38.4-12.8l-105.472 92.16c4.096 10.24 6.144 20.992 6.656 31.744 0.512 10.752-0.512 22.016-3.072 32.768-3.072 11.264-7.168 21.504-13.312 31.232-6.656 10.24-14.336 19.968-23.552 28.16-6.656 5.632-13.312 10.752-20.992 15.36-29.184 17.408-64 23.552-97.28 17.408-8.192-1.536-15.872-3.584-23.552-6.656-7.68-3.072-14.848-6.656-22.016-10.752-7.168-4.608-13.312-9.728-19.456-15.36-11.264-10.752-19.968-24.064-25.6-38.912-5.12-13.824-7.168-28.672-6.144-43.52 1.024-14.848 5.12-29.184 12.288-43.008 7.68-14.336 17.92-27.136 30.208-37.376 12.8-10.752 27.648-18.944 43.008-24.576 20.48-7.168 42.496-9.728 64.512-7.168 11.264 1.536 22.016 4.096 32.256 8.192 5.12 2.048 10.24 4.096 15.36 7.168l97.28-83.968c-9.216-11.776-16.384-25.088-21.504-39.424-9.216-27.136-8.704-56.32 1.024-83.456 5.12-13.824 12.288-26.624 21.504-38.4l-89.088-76.8c-9.216 4.096-18.432 7.168-28.16 9.216-16.896 3.584-34.816 4.096-51.712 1.024-7.168-1.024-14.848-3.072-21.504-5.632-7.168-2.56-13.824-5.632-19.968-9.216s-12.288-7.68-17.92-12.8c-10.24-8.704-18.432-19.968-23.552-32.256-4.608-11.264-6.656-24.064-5.632-36.352 1.024-12.288 4.608-24.576 11.264-35.84 7.168-12.288 16.384-22.528 27.648-31.232 6.144-4.608 12.288-8.704 18.944-11.776 6.656-3.584 13.312-6.144 20.48-8.704 13.824-4.608 28.672-6.656 43.52-6.656 7.168 0 14.848 0.512 22.016 1.536 7.168 1.024 14.336 3.072 20.992 5.12s13.312 5.12 19.456 8.704 12.288 7.168 17.408 11.776c8.192 7.168 14.848 14.848 19.968 23.552 10.24 16.384 13.824 35.84 10.24 54.784-1.536 9.728-5.12 18.944-10.24 27.648l92.672 78.848c18.944-8.704 39.424-14.848 59.904-16.896 23.04-2.56 46.592-1.024 69.632 5.12 7.68 2.048 15.872 4.608 23.04 7.68 7.68 3.072 14.848 6.656 22.016 10.752l87.04-74.752c-7.168-8.704-12.288-18.944-15.36-29.696-3.072-10.24-4.096-20.992-3.072-31.232s4.096-20.48 9.728-30.208c5.632-10.24 12.8-18.944 21.504-26.112 5.632-4.608 11.264-8.704 17.408-11.776 6.144-3.584 12.8-6.144 19.456-8.704 6.656-2.048 13.824-4.096 20.992-5.12 8.192-0.512 15.36-1.024 22.528-1.024z" fill="#2B85FB" p-id="5067"></path></svg>
                    `)
                }

                if (item.region === 0) {
                    // 国外
                    $newImage.find(".isCN").append(`
                    <svg t="1690365276304" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2827" width="32" height="32"><path d="M500.736 85.333333c229.76 0 416 186.24 416 416S730.496 917.333333 500.736 917.333333s-416-186.24-416-416S270.976 85.333333 500.736 85.333333z m172.565333 109.12l0.234667-0.490666c-3.050667 6.826667-6.101333 13.44-9.216 19.84l-6.229333 12.522666c-34.496 67.2-72.96 107.221333-125.226667 107.221334-13.525333 0-22.314667 0.618667-28.352 1.941333l-3.818667 0.896c-0.085333 0-0.128-0.021333-0.128-0.064l-0.128 0.256a14.805333 14.805333 0 0 0-0.32 5.610667l0.426667 3.797333 0.832 4.736 1.237333 5.696 0.810667 3.2 2.005333 7.125333c0.362667 1.28 0.768 2.581333 1.194667 3.946667l2.858667 8.64c1.066667 3.050667 2.197333 6.272 3.477333 9.664 20.053333 53.546667 6.997333 106.112-29.098667 134.997333-39.317333 31.466667-92.629333 21.973333-112.277333-27.925333l-6.037333-15.146667-5.162667-12.544-3.050667-7.061333-3.434666-7.466667-3.114667-6.058666-1.173333-2.069334-2.261334-3.605333c-4.053333-5.909333-7.68-8.362667-12.16-9.322667l-3.178666-0.448-3.541334-0.106666-17.130666 0.213333-10.816-0.064c-23.893333-0.448-38.933333-3.712-53.248-14.634667-24.106667-18.410667-26.773333-47.616-12.992-83.072l1.92-4.650666c10.090667-23.872 8.832-40.661333-4.714667-55.402667A350.442667 350.442667 0 0 0 148.736 501.333333c0 194.410667 157.610667 352 352 352 31.424 0 61.866667-4.117333 90.837333-11.84 4.693333-27.861333-6.037333-50.026667-33.728-70.570666l-4.010666-2.88c-84.138667-58.56-87.893333-151.402667-22.592-191.146667 50.688-30.869333 105.6-31.488 146.432 8.597333l3.776 3.882667c8.106667 8.64 13.013333 12.074667 16.789333 13.162667l1.962667 0.426666 2.453333 0.128 2.24-0.085333 4.970667-0.533333 11.242666-1.514667c7.701333-1.088 13.546667-1.770667 20.096-2.218667 38.08-2.666667 62.933333 12.16 80.853334 46.506667a350.570667 350.570667 0 0 0 30.677333-143.914667c0-131.712-72.32-246.506667-179.434667-306.88z m-108.8 437.12c-22.869333 13.930667-22.186667 48.341333 21.674667 80.917334l4.224 3.029333c39.829333 27.733333 62.016 62.421333 65.706667 101.76a353.173333 353.173333 0 0 0 123.669333-101.333333l-1.066667-4.394667-2.346666-8.746667-1.130667-3.946666-2.218667-7.189334-1.109333-3.242666-2.176-5.781334c-6.933333-16.896-13.866667-20.778667-24.064-20.053333l-5.76 0.490667-6.272 0.746666-15.893333 2.176-7.68 0.853334-6.186667 0.384a61.546667 61.546667 0 0 1-8.533333-0.341334l-5.696-0.810666-1.258667-0.213334c-19.242667-3.392-35.925333-13.845333-53.653333-32.768-17.706667-18.922667-41.429333-19.072-70.208-1.557333zM500.757333 149.333333c-84.992 0-162.965333 30.122667-223.786666 80.298667 30.869333 32.362667 37.973333 74.112 20.309333 120.021333l-2.133333 5.312a91.285333 91.285333 0 0 0-4.074667 11.456l-0.341333 1.28 5.226666 0.426667 4.416 0.213333 2.496 0.042667h12.778667l12.842667-0.149333c38.101333 0 57.706667 11.370667 77.717333 48.256l4.309333 8.298666 4.352 9.109334 4.458667 9.941333 4.586667 10.837333 7.253333 17.941334c2.773333 7.082667 5.098667 7.509333 12.714667 1.408 13.973333-11.178667 19.733333-34.346667 9.173333-62.570667-19.818667-52.864-22.741333-88.042667-3.648-113.621333 15.658667-20.970667 36.437333-27.178667 72.256-28.138667l11.2-0.149333c23.488 0 54.101333-39.68 82.026667-101.269334A350.997333 350.997333 0 0 0 500.736 149.333333z" fill="#1677FF" p-id="2828"></path></svg>
                    `)
                }
                // 将当前创建的图片元素附加到 $box

                $box.append($newImage);

                const img = new Image();
                img.src = item.image + "?cache=" + Date.now();
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
            initializePopovers();
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
                    let NewfilteredData;
                    function PKgenerateHTML(Data) {
                        dataBox.empty(); // 清空原有的内容
                        Data.forEach((item, index) => {
                            let html = $(`<div class="shadow dataContent">
                                <span >"${item.name}"</span>
                            </div>`);
                            dataBox.append(html);

                            html.click(function () {
                                $(this).toggleClass("Boxactiv");
                                if ($(this).hasClass("Boxactiv")) {
                                    $(".select").append(`<div></span><span index="${index}">"${item.name}"</span></div>`);
                                    select.push(index);
                                } else {
                                    $(".select").find(`span[index="${index}"]`).parent().remove();
                                    const removeIndex = select.indexOf(index);
                                    if (removeIndex !== -1) {
                                        // 使用 splice 方法删除该索引
                                        select.splice(removeIndex, 1);
                                    }
                                }
                            });
                        });
                    }
                    $("#contrast").click(() => {
                        const filteredData = filterDataByIndex(NewfilteredData || data, select);
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

                    $('.image-hosting-buttons button').on('click', function () {
                        // 重新生成HTML
                        $(".select").empty()
                        $('.image-hosting-buttons button').css('background-color', '');
                        select = []
                        const type = $(this).data('type');
                        $(this).css('background-color', '#eee');
                        if (type === 'all') {
                            NewfilteredData = data
                        } else if (type === 'foreign') {
                            //国外
                            NewfilteredData = data.filter(item => item.region === 0);
                        } else if (type === 'domestic') {
                            //国内
                            NewfilteredData = data.filter(item => item.region !== 0);
                        } else if (type === 'CDN') {
                            //cdn
                            NewfilteredData = data.filter(item => item.CDN === 1);
                        } else if (type === 'direct') {
                            //直连
                            NewfilteredData = data.filter(item => item.CDN === 0);
                        }
                        // 重新生成HTML
                        PKgenerateHTML(NewfilteredData);
                    });
                    PKgenerateHTML(data)
                }
            }, 1000);
        }

        // 开始倒计时
        startCountdown();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });




