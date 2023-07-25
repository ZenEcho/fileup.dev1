function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
fetch("https://fileup.dev/imgtestData.json")
    .then(response => response.text())
    .then(res => {
        try {
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

            // 页面加载时生成HTML
            const currentPage = 1;

            // 倒计时3秒后生成HTML
            const jsonObject = JSON.parse(res);
            let data = jsonObject.data;
            data.forEach(item => {
                item.image += `?cache=${Date.now()}`;
            });
            // 随机洗牌数组
            shuffleArray(data);

            $(document).ready(function () {
                let countdown = 3;

                // 倒计时函数
                function startCountdown() {
                    const countdownInterval = setInterval(() => {
                        $box.empty().text(`等待：${countdown}秒`);
                        countdown--;

                        if (countdown < 0) {
                            clearInterval(countdownInterval);
                            generateHTML();
                        }
                    }, 1000);
                }

                let $box = $('#box'); // 使用jQuery选择器获取box元素

                // 开始倒计时
                startCountdown();
            });

        } catch (error) {
            console.error('Error parsing data:', error);
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

