$(document).ready(function () {
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
            try {
                console.log(res)
                // 生成HTML的函数
                function generateHTML() {
                    const itemsPerPage = 6;
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const currentData = data.slice(startIndex, endIndex);

                    let $box = $('#box'); // 使用jQuery选择器获取box元素
                    $box.empty()
                    currentData.forEach(item => {
                        const startTime = Date.now();

                        // 添加图片元素，并设置onload事件处理函数
                        $box.append(`
                        <div class="box">
                            <h3><a href="${item.link}" target="_blank">${item.link}</a></h3>
                            <p style=" font-size: 0.7em;">${item.introduce}</p>
                            <img src="${item.image}">
                        </div>
                    `);

                        $box.find('img').last().on('load', function () {
                            // 在class="box"末尾插入加载时间
                            const endTime = Date.now();
                            const loadTime = endTime - startTime;
                            $(this).parent().append(`
                            <p class="text-center">加载时间：${loadTime}毫秒</p>
                        `);
                        });

                    });
                }
                function contrastGenerateHTML(currentData) {
                    let $box = $('#box'); // 使用jQuery选择器获取box元素
                    $box.empty()
                    currentData.forEach(item => {
                        const startTime = Date.now();

                        // 添加图片元素，并设置onload事件处理函数
                        $box.append(`
                        <div class="box">
                            <h3><a href="${item.link}" target="_blank">${item.link}</a></h3>
                            <p style=" font-size: 0.7em;">${item.introduce}</p>
                            <img src="${item.image}">
                        </div>
                    `);

                        $box.find('img').last().on('load', function () {
                            // 在class="box"末尾插入加载时间
                            const endTime = Date.now();
                            const loadTime = endTime - startTime;
                            $(this).parent().append(`
                            <p class="text-center">加载时间：${loadTime}毫秒</p>
                        `);
                        });

                    });
                }
                // 页面加载时生成HTML
                const currentPage = 1;

                // 倒计时3秒后生成HTML
                const jsonObject = JSON.parse(res);
                let data = jsonObject.data;
                // 随机洗牌数组
                shuffleArray(data);
                data.forEach(item => {
                    item.image += `?cache=${Date.now()}`;
                });

                // 倒计时函数
                let countdown = 3;
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
                                            <span >"${item.link}"</span>
                                        </div>`)
                                dataBox.append(html);

                                html.click(function () {
                                    $(this).toggleClass("Boxactiv");
                                    if ($(this).hasClass("Boxactiv")) {
                                        $(".select").append(`<span index="${index}" style=" border: 1px solid; margin:10px; padding: 5px; ">"${item.link}"</span>`);
                                        select.push(index)
                                    } else {
                                        $(".select").find(`span:contains("${item.link}")`).remove();
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
                                if (filteredData.length != 0) {
                                    contrastGenerateHTML(filteredData)
                                }
                                if (filteredData.length == 1) {
                                    $("#box").addClass("count1");
                                }
                                if (filteredData.length == 2) {
                                    $("#box").addClass("count2");
                                }
                                if (filteredData.length > 2) {
                                    $("#box").addClass("count3");
                                }
                            })
                        }
                    }, 1000);
                }

                let $box = $('#box'); // 使用jQuery选择器获取box元素

                // 开始倒计时
                startCountdown();


            } catch (error) {
                console.error('Error parsing data:', error);
                $('#box').after(`
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">👇错误👇</h4>
                    <hr>
                    <p>`+error+`</p>
                    <hr>
                    <p class="mb-0">👆错误信息👆</p>
                </div>
                `)
                // text(error)
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});



