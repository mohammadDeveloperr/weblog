const moment=require('jalali-moment');

module.exports.formatDate=date=>{
    return moment(date).locale("fa").format("YYYY-MM-DD");
}