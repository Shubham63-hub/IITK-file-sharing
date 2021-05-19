const dropzone = document.querySelector(".drop-zone");
const fileinput = document.querySelector("#fileinput");
const browsebtn = document.querySelector(".browsebtn");
const progresscontainer = document.querySelector(".progress-container");
const bgprogress = document.querySelector(".bg-progress");
const percentdiv = document.querySelector("#percent");
const progressbar = document.querySelector(".progress-bar");
const fileurl = document.querySelector("#fileurl");
const copybutton = document.querySelector("#copybutton");
const toast = document.querySelector(".toast");

const sharingcontainer = document.querySelector(".sharing-container");
const host = "https://demo-file-sharing.herokuapp.com/";
const uploadurl = `${host}api/files`;
const emailurl = `${host}api/files/send`;

dropzone.addEventListener("dragover", (e)=> {
    e.preventDefault();

    if(!dropzone.classList.contains("dragged")){
        dropzone.classList.add("dragged");
    }
    
});

dropzone.addEventListener("dragleave",()=>{
    dropzone.classList.remove("dragged");
});

dropzone.addEventListener("drop",(e)=>{
    e.preventDefault();
    const files = e.dataTransfer.files;
    dropzone.classList.remove("dragged");
    if(files.length){
        fileinput.files = files;
        uploadfile();
    }
});

fileinput.addEventListener("change", ()=>{
    uploadfile();
})

browsebtn.addEventListener("click", ()=>{
    fileinput.click();
});

copybutton.addEventListener("click", ()=>{
    fileurl.select();
    document.execCommand("copy");
    showtoast("Link Copied");
})

const uploadfile = ()=>{

    
    if(fileinput.files.length > 1){
        fileinput.value = "";
        showtoast("only upload one file");
        return;
    }
    progresscontainer.style.display = "block";
    const file = fileinput.files[0];
    if(file.size > 100 * 1024 * 1024){
        showtoast("can't upload more than 100mb");
        fileinput.value = "";
        return;
    }

    const formData = new FormData();
    formData.append("myfile",file);

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = ()=>{
        if( xhr.readyState === XMLHttpRequest.DONE){
            // console.log(xhr.response);
            onuploadsuccess(JSON.parse(xhr.response));
        }
    };
    xhr.upload.onprogress = updateprogress;

    xhr.upload.onerror = ()=>{
        fileinput.value = "";
        showtoast(`Error in upload: ${xhr.statusText}`)
    }

    xhr.open("POST", uploadurl);
    xhr.send(formData);

};

const updateprogress = (e)=>{
    const percent = Math.round((e.loaded/e.total) * 100);
    // console.log(percent);
    bgprogress.style.width = `${percent}%`;
    percentdiv.innerText = percent;
    // progressbar.style.transform = 'scaleX(${percent}/100)'
}

const onuploadsuccess = ({file: url})=>{
    // console.log(file);
    fileinput.value = "";
    progresscontainer.style.display = "none";
    sharingcontainer.style.display = "block";
    fileurl.value = url;
};



let toasttimer;
const showtoast= (msg)=>{
    toast.innerText = msg;
    // toast.style.transform = "translate(-50% ,0)";
    toast.classList.add("show");
    clearTimeout(toasttimer);
    toasttimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);

    
}
