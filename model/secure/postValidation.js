const yup=require('yup');

const schema=yup.object().shape({
    title:yup.string().required("عنوان پست الزامی میباشد").
        min(5,"عنوان باید از 5 کاراکتر بیشتر باشد").
        max(100,"عنوان نمیتواند از 100 کاراکتر بیشتر باشد"),
        body:yup.string().required("پست جدید باید دارای محتوا باشد"),
        status:yup.mixed().oneOf(['public',"private"],"وضعیت باید یا خصوصی باشد یا عمومی"),
        thumbnail:yup.object().shape({
            name:yup.string().required("عکس بند انگشتی الزامی میباشد"),
            size:yup.number().max(3000000,"عکس نباید بیشتر از 3 مگابایت باشد"),
            mimetype:yup.mixed().oneOf(['image/jpeg','image/png'],"تنها پسوند های jpeg و png پشتیبانی میشود")
        })
})

module.exports=schema; 