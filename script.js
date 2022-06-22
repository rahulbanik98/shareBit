const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browseBtn");
const fileinput = document.querySelector("#fileinput");

//PROGRESS BAR
const bgProgress = document.querySelector(".bg-progress");
const percentDiv = document.querySelector("#percent");
const progressContainer = document.querySelector(".progress-container");

//PROGRESS LINE
const progressBar = document.querySelector(".progress-bar");

//HOST
const host = "https://innshare.herokuapp.com/";
const uploadURL = `${host}api/files`;
// const uploadURL = `${host}api/files`;

dropZone.addEventListener("dragover", (e)=>{
    e.preventDefault();

    if(!dropZone.classList.contains("dragged"))
    {
        dropZone.classList.add("dragged");
    }    
});

dropZone.addEventListener("dragleave", ()=>{
    dropZone.classList.remove("dragged");
})

dropZone.addEventListener("drop", (e)=>{
    e.preventDefault();
    dropZone.classList.remove("dragged")

    const files = e.dataTransfer.files;
    console.table(files)

    if(files.length)
    {
        fileinput.files = files;
        uploadFile()
    }
})

fileinput.addEventListener("change", ()=>{
    uploadFile()
})

browseBtn.addEventListener("click", ()=>{
    fileinput.click()
})

//FILE UPLOAD FUNCTION

const uploadFile = () =>{
    //RUN TIME PROGRESS SECTION OPEN
    progressContainer.style.display = "block"
    //END
    
    const file = fileinput.files[0];
    const formData = new FormData();
    formData.append("myfile", file);

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = ()=>{
        if(xhr.readyState === XMLHttpRequest.DONE)
        {
            console.log(xhr.response)
            showLink(JSON.parse(xhr.response));
        }
    };

    xhr.upload.onprogress = updateProgress;

    xhr.open("POST", uploadURL);
    xhr.send(formData);
};

//FILE UPLOAD RUNTIME DISIGN FUNCTION
const updateProgress = (e)=>{
    const percent = Math.round((e.loaded / e.total) * 100);
    console.log(percent);
    bgProgress.style.width = `${percent}%`;
    percentDiv.innerHTML = percent;
    progressBar.style.transform = `scaleX(${percent/100})`;
}

const showLink = ({file})=>{
    console.log(file);
    progressContainer.style.display = "none";
}