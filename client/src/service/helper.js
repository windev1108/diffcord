import dayjs from "dayjs";


export const colors = ["#757E8A", "#3BA55C", "#5865F2", "#FAA61A" , "#ED4245" ]


export const SERVICE_ID = "service_idp0v9t"

export const TEMPLATE_ID = "template_vo8xbhs"

export const PUBLIC_KEY = "tsWskGPpf00sAjImx"



export const AGORA_TOKEN = "007eJxTYFDy90uyyJZL+tHO8vbxXa29czlCOoJ1hdTUNBzsotbVfFFgSDJPTjI1tjA1Mko1NDE3MrQ0t0yytEwzM040MklKMjaMmled3BDIyFAYJ8rEyACBID4LQ25iZh4DAwA5zxtc"


  export const handleTimer = (time) => {
    let results;
    let month;
    const date = new Date();
    const dayNow = date.getDate();
    const hoursNow = date.getHours();
    const minNow = date.getMinutes();
    const monthNow = date.getMonth() + 1;
    const year = +time.substr(11, 4)
    const day = +time.substr(8, 2);
    const hours = +time.substr(16, 2);
    const min = +time.substr(19, 2);

    switch (time.substr(4, 3)) {
      case "Jan":
        month = 1;
        break;
      case "Feb":
        month = 2;
        break;
      case "Mar":
        month = 3;
        break;
      case "Apr":
        month = 4;
        break;
      case "May":
        month = 5;
        break;
      case "Jun":
        month = 6;
        break;
      case "Jul":
        month = 7;
        break;
      case "Aug":
        month = 8;
        break;
      case "Sep":
        month = 9;
        break;
      case "Oct":
        month = 10;
        break;
      case "Nov":
        month = 11;
        break;
      case "Dec":
        month = 12;
        break;
      default:
        time.substr(4, 3);
    }

    if (day === dayNow && hours === hoursNow && min === minNow) {
      results = "Just now";
    } else if (day === dayNow && hours === hoursNow && min < minNow) {
      results = minNow - min > 1 ? ` ${minNow - min} mins ago`  : `${minNow - min} min ago`; ;
    } else if (day === dayNow && min !== minNow) {
      results = hoursNow - hours > 1 ?   `${hoursNow - hours} hours ago` : `${hoursNow - hours} hour ago`;
    } else if (month === monthNow && day !== dayNow) {
      results = dayNow - day  > 1 ? `${dayNow - day} days ago` : `${dayNow - day} day ago`;
    } else if (month !== monthNow) {
      results = monthNow - month > 1 ? `${monthNow - month} months ago` : `${monthNow - month} month ago`
    }
    return `${day} tháng ${month} năm ${year}`;
  };

  export const handleTimeAgo = (time) => {
    let results;
    let month;
    const date = new Date();
    const dayNow = date.getDate();
    const hoursNow = date.getHours();
    const minNow = date.getMinutes();
    const monthNow = date.getMonth() + 1;
    const day = +time.substr(8, 2);
    const hours = +time.substr(16, 2);
    const min = +time.substr(19, 2);

    if (day === dayNow && hours === hoursNow && min === minNow) {
      results = "vừa xong";
    } else if (day === dayNow && hours === hoursNow && min < minNow) {
      results =  ` ${minNow - min} phút trước` 
    } else if (day === dayNow && min !== minNow) {
      results =  `${hoursNow - hours} giờ trước`
    } else if (month === monthNow && day !== dayNow) {
      results =  `${dayNow - day} ngày trước`
    } 
    return `${hours}:${min} `
  } 

  export const typeImage =  "https://firebasestorage.googleapis.com/v0/b/discord-6e069.appspot.com/o/file%"
  
export const TYPE_NUMBER =  "0"|1||2||3||4||5||6||7||8||9



  export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const regex_emoji = /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/u;



export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const formatter = dayjs(date);
  const now = new Date();

  if (dayjs().isSame(formatter, "date")) return formatter.format("h:mm A");

  if (dayjs().isSame(formatter, "week")) return formatter.format("ddd h:mm A");

  if (now.getFullYear() === date.getFullYear())
    return formatter.format("MMM DD h:mm A");

  return formatter.format("DD MMM YYYY h:mm A");
};
