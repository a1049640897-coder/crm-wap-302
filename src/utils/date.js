/**
 * 生成年份
 * @param {开始年份} startYear 
 * @return {Array} 时间数组
 */
export const makeYear = (startYear = 1999) => {
    const dates = []
    let my = new Date();
    let endYear = my.getFullYear(); // 获取当前年份 
    for (let i = startYear; i <= endYear + 10; i++) {
        dates.push({
            value: i,
            text: i
        });
    }
    return dates.reverse()
}

// 截止日期-倒计时
export const dateCount = (endTime) => {
    // 现在时间
    var now = new Date();
    //截止时间
    var until = new Date(endTime);
    var days = (until - now) / 1000 / 3600 / 24;
    var day = Math.floor(days);
    var hours = (days - day) * 24;
    var hour = Math.floor(hours);
    var minutes = (hours - hour) * 60;
    var minute = Math.floor(minutes);
    var seconds = (minutes - minute) * 60;
    var second = Math.floor(seconds);
    var back = {
        day: day,
        hour: hour,
        minute: minute,
        second: second
    }
    return back;
}

export const dateCountDown = (secondsDown) => {
    var days = secondsDown / 3600 / 24;
    var day = Math.floor(days);
    var hours = (days - day) * 24;
    var hour = Math.floor(hours);
    var minutes = (hours - hour) * 60;
    var minute = Math.floor(minutes);
    var seconds = (minutes - minute) * 60;
    var second = Math.floor(seconds);
    var back = {
        day: day,
        hour: hour < 10 ? '0' + hour : hour,
        minute: minute < 10 ? '0' + minute : minute,
        second: second < 10 ? '0' + second : second
    }
    return back;
}