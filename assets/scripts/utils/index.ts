import { sys } from "cc";

var invalid_id = ['root', 'admin', 'system', '系统', 'id', '管理'];
var invalid_msg = ['习近平', '李强', '共产党', '黄色', '几吧', '鸡巴', '草你', '操你', '傻逼', '煞笔', '垃圾', '骚逼', '骚B', '贱人', '你妈'];

function create_pattern(list: any[]) {
    var re = "";
    for(var i=0;i<list.length;i++){
        if(i == list.length-1)
            re += list[i];
        else
            re += list[i] + "|";
    }
    return new RegExp(re, "i");
}

const id_pattern = create_pattern(invalid_id);
const msg_pattern = create_pattern(invalid_msg);


const utils = {

    invalid_id(str){
        return utils.invalid_token(str) || id_pattern.test(str) || msg_pattern.test(str);
    },

    invalid_msg(str){
        return msg_pattern.test(str);
    },

    random_one(list: any[]) {
        return list[utils.random(0, list.length-1)];
    },

    check_email(email: string): boolean {
        var pattern = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        return pattern.test(email);
    },

    getBrowserValue(key: string) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == key) {
                return pair[1];
            }
        }
        return null;
    },

    /**
   * 设置系统剪贴板的内容
   * @param str 
   */
    setClipboardData(str: string): boolean {
        if (!str || str == '') return false;
        if (sys.platform == 'MOBILE_BROWSER' || sys.platform == 'DESKTOP_BROWSER'){
            if (!document.queryCommandSupported('copy')) {
                return false;
            }
            let textarea = document.createElement("textarea")
            textarea.value = str
            document.body.appendChild(textarea)
            textarea.select()
            textarea.setSelectionRange(0, str.length)
            let ok = document.execCommand("copy");             
            textarea.remove();
            return ok;
        }
        return false;
    },

    // 只保留整数(万)
    amount2tenthousand(num: number){
        return 10000 * Math.floor(num/10000);
    },


    /**
    * 数字转整数 如 100000 转为10万
    * @param {需要转化的数} num
    * @param {需要保留的小数位数} point
    */
    amount2str(num: number, point: number = 2) {
        let numStr =  Math.abs(parseInt(num.toString())).toString();
        let prex = "";
        if (num < 0) {
            prex = "-";
        }
        num = Math.abs(num);

        // 1万以内直接返回
        if (numStr.length < 5) {
            return prex + numStr;
        }
        //大于8位数是亿
        else if (numStr.length > 8) {
            let decimal = numStr.substring(numStr.length - 8, numStr.length - 8 + point);
            return prex + parseFloat(Math.floor(num / 100000000) + '.' + decimal) + '亿';
        }
        //大于等于5位数是万
        else if (numStr.length >= 5) {
            let decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
            return prex + parseFloat(Math.floor(num / 10000) + '.' + decimal) + '万';
        }
    },
    
    
    random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    is_mail(s: string) {
        return s.indexOf("@") > 0;
    },

    invalid_pswd(pswd: string) {
        let p = /\s/;
        return p.test(pswd);
    },

    // 只能包含英文,数字,下划线, 以及中文
    invalid_token(id: string) {
        let p = /[^\w\u4e00-\u9fa5]/;
        return p.test(id);
    }
}


export default utils