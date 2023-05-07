

document.getElementById('imageUpload').onclick = function () {
    const xhttp = new XMLHttpRequest();
    const imageStatus = document.getElementById('imageStatus');
    const selectedImage = document.getElementById('selectedImage');
    const uploadResult = document.getElementById('uploadResult');


     // xhttp.responseType = "json";

    xhttp.onreadystatechange = function () {
        if (this.status == 200) {

            imageStatus.innerHTML = "اپلود با موفقیت انجام شد";   //this.response.message
            uploadResult.innerHTML=this.responseText   //this.response.address

            selectedImage.value="" //?set input clear
        } else {
            imageStatus.innerHTML = this.responseText
        }
    }

    if (selectedImage.files.length > 0) {

        xhttp.open("POST","/dashboard/image-upload");
        xhttp.upload.onprogress=e=>{
            let result=parseInt((e.loaded/e.total)*100)
            
            if(result !==100)
            {
                document.getElementById('range').style.display="block"
                imageStatus.innerHTML ="عکس در حال اپلود میباشد..."
                document.getElementById('inputRange').style.width=""+result+"%"

            }else
            {
                document.getElementById('range').style.display="none"
            }
        }
        
        let formData = new FormData();
        formData.append("image", selectedImage.files[0])

        xhttp.send(formData)
    }
    else {
        imageStatus.innerHTML = "برای اپلود باید عکسی را انخاب کنید";
    }
}