const dropZone = document.querySelector(".drop-zone");
const browseBtn = document.querySelector(".browseBtn");
const fileinput = document.querySelector("#fileinput");

//PROGRESS BAR
const bgProgress = document.querySelector(".bg-progress");
const percentDiv = document.querySelector("#percent");
const progressContainer = document.querySelector(".progress-container");

//PROGRESS LINE
const progressBar = document.querySelector(".progress-bar");

const sharingContainer = document.querySelector(".sharing-container");

//GET LINK INTO THE BOX
const fileURLInput = document.querySelector("#fileURL");

//COPY BTN
const copyBtn = document.querySelector("#copyBtn");

//FETCH DATA FROM FORM
const emailForm = document.querySelector("#emailForm");

//HOST
const host = "https://innshare.herokuapp.com/";
const uploadURL = `${host}api/files`;

// EMAIL API
const emailURL = `${host}api/files/send`;

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

//COPY BTN FUNCTION
copyBtn.addEventListener("click", ()=>{
    fileURLInput.select();
    document.execCommand("copy");
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

const showLink = ({file: url})=>{
    console.log(url);
    emailForm[2].removeAttribute("disabled");
    progressContainer.style.display = "none";

    //Hide loading and Copy Part
    sharingContainer.style.display = "block";

    //put the link in input section
    fileURLInput.value = url;
}

emailForm.addEventListener("submit", (e)=>{
// DO NOT SHOW THE DETAILS IN THE URL SECTION
    e.preventDefault();

    console.log("Submit Form");
    const url = fileURLInput.value;

    // THIS IS FOR BACKEND
    const formData = {
        uuid: url.split("/").splice(-1, 1) [0],
        emailTo: emailForm.elements["to-email"].value,
        emailForm: emailForm.elements["from-email"].value,
    };

    emailForm[2].setAttribute("disabled", "true");
    console.table(formData);

    // LINK SEND SETTINGS
    fetch(emailURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        // CHANGE JAVASCRIPT OBJECT INTO JSON
        body: JSON.stringify(formData),
    })
    .then((res) => res.json())
    .then(({success}) => {
        if(success)
        {
            sharingContainer.style.display = "none";
        }
    });
});