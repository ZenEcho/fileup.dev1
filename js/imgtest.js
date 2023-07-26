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
                    <p style="font-size: 0.7em;">${item.introduce}</p>
                    <div class="loading"></div>
                  </div>
                `);

                // 将当前创建的图片元素附加到 $box

                $box.append($newImage);
                const img = new Image();
                img.src = item.image + "?cache=$" + Date.now();
                const startTime = Date.now();
                img.onload = function () {
                    $newImage.find(".loading").remove()
                    // 获取图片宽度和高度
                    $newImage.append(img);
                    const endTime = Date.now();
                    let loadTime = endTime - startTime;
                    let time;
                    if (loadTime > 1000) {
                        loadTime = loadTime / 1000
                        time = "秒"
                    } else {
                        time = "毫秒"
                    }
                    $(this).parent().append(`
                        <p class="text-center">加载时间：${loadTime}${time}</p>
                    `);
                };
                img.onerror = function () {
                    $newImage.find(".loading").remove()
                    $newImage.append(`
                    <div class="alert alert-danger" role="alert">
                        图片加载失败
                    </div>
                    `);
                };

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




