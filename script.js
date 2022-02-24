
//Mouse Circle
const mouseCircle = document.querySelector(".mouse-cricle");
const mouseDot = document.querySelector(".mouse-dot");

let mouseCircleBool = true;

const mouseCircleFn = (x,y) => {
    mouseCircleBool &&
    (mouseCircle.style.cssText = `top: ${y}px; left: ${x}px; opacity:1`);

    mouseDot.style.cssText = `top: ${y}px; left: ${x}px; opacity:1`;
};
//End of Mouse Circle


//Animated circle
const circles = document.querySelectorAll(".circle");
const mainImg = document.querySelector(".main-circle img");

let mX = 0;
let mY = 0;
const z = 100;
const animateCircles = (e,x,y)=>{

    if(x<mX){
        circles.forEach((circle)=>{
            circle.style.left = `${z}px`;
        });
        mainImg.style.left = `${z}px`;
    }else if(x>mX){
        circles.forEach((circle)=>{
            circle.style.left = `-${z}px`;
        });
        mainImg.style.left = `-${z}px`;
    }

    if(y<mY){
        circles.forEach((circle)=>{
            circle.style.top = `${z}px`;
        });
        mainImg.style.top = `${z}px`;
    }else if(y>mY){
        circles.forEach((circle)=>{
            circle.style.top = `-${z}px`;
        });
        mainImg.style.top = `-${z}px`;
    }

    mX = e.clientX;
    mY = e.clientY;

}
//End of Animated circle

let hoveredE1Position = [];

const stickyElement = (x,y,hoveredEl)=>{
    //sticky elements
    if(hoveredEl.classList.contains("sticky")){
        hoveredE1Position.length<1 &&
        (hoveredE1Position = [hoveredEl.offsetTop, hoveredEl.offsetLeft]);


        hoveredEl.style.cssText = `top:${y}px;left:${x}px`;

        if(hoveredEl.offsetTop<=hoveredE1Position[0]-100 ||
            (hoveredEl.offsetTop>=hoveredE1Position[0]+100) ||
            hoveredEl.offsetLeft<=hoveredE1Position[1]-100||
            hoveredEl.offsetLeft>=hoveredE1Position[1]+100){
            hoveredEl.style.cssText = "";
            hoveredE1Position = [];
        }

        hoveredEl.onmouseleave = () => {
            hoveredEl.style.cssText = "";
            hoveredE1Position = [];
        };
    }
    //end of sticky elements
}

// Mouse Circle Transform
const mouseCircleTransform = (hoveredEl) => {
    if (hoveredEl.classList.contains("pointer-enter")) {
        hoveredEl.onmousemove = () => {
            mouseCircleBool = false;
            mouseCircle.style.cssText = `
      width: ${hoveredEl.getBoundingClientRect().width}px;
      height: ${hoveredEl.getBoundingClientRect().height}px;
      top: ${hoveredEl.getBoundingClientRect().top}px;
      left: ${hoveredEl.getBoundingClientRect().left}px;
      opacity: 1;
      transform: translate(0, 0);
      animation: none;
      border-radius: ${getComputedStyle(hoveredEl).borderBottomLeftRadius};
      transition: width .5s, height .5s, top .5s, left .5s, transform .5s, border-radius .5s;
      `;
        };

        hoveredEl.onmouseleave = () => {
            mouseCircleBool = true;
        };

        document.onscroll = () => {
            if (!mouseCircleBool) {
                mouseCircle.style.top = `${hoveredEl.getBoundingClientRect().top}px`;
            }
        };
    }
};
// End of Mouse Circle Transform

document.body.addEventListener("mousemove",(e)=>{
    let x = e.clientX;
    let y = e.clientY;
    mouseCircleFn(x,y);
    animateCircles(e,x,y);

    const hoveredEl = document.elementFromPoint(x,y);

    stickyElement(x,y,hoveredEl);

    mouseCircleTransform(hoveredEl);
});

document.body.addEventListener("mouseleave",()=>{
    mouseCircle.style.opacity = "0";
    mouseDot.style.opacity = "0";
});

//main button
const mainBtns = document.querySelectorAll(".main-btn");

mainBtns.forEach(btn=>{
    let ripple;

    btn.addEventListener("mouseenter",(e)=>{
        const left = e.clientX - e.target.getBoundingClientRect().left;
        const top = e.clientY - e.target.getBoundingClientRect().top;

        ripple = document.createElement("div");
        ripple.classList.add("ripple");
        ripple.style.left = `${left}px`;
        ripple.style.top = `${top}px`;
        btn.prepend(ripple);
    });
    btn.addEventListener("mouseleave",()=>{
        btn.removeChild(ripple);
    })
})
//end of main button


//progress bar
const sections = document.querySelectorAll("section");
const progressBar = document.querySelector(".progress-bar");
const halfCircles = document.querySelectorAll(".half-circle");
const halfCircleTop = document.querySelector(".half-circle-top");
const progressBarCircle = document.querySelector(".progress-bar-circle");

let scrolledPortion = 0;
let scrollBool  = false;
let imageWrapper = false;

const progressBarFn = (bigImgWrapper ) =>{

    imageWrapper = bigImgWrapper;

    let pageHeight = 0;

    const pageViewportHeight = window.innerHeight;

    if(!bigImgWrapper){
        pageHeight = document.documentElement.scrollHeight;
        scrolledPortion = window.pageYOffset;
    }else{
        pageHeight = bigImgWrapper.firstElementChild.scrollHeight;
        scrolledPortion = bigImgWrapper.scrollTop;
    }

    // const pageViewportHeight = window.innerHeight;
    // const pageHeight = document.documentElement.scrollHeight;
    // const scrolledPortion = window.pageYOffset;

    const scrolledPortionDegree = (scrolledPortion/(pageHeight-pageViewportHeight))*360;
    halfCircles.forEach((el) =>{
        el.style.transform = `rotate(${scrolledPortionDegree}deg)`;

        if(scrolledPortionDegree >= 180){
            halfCircles[0].style.transform = "rotate(180deg)";
            halfCircleTop.style.opacity = "0";
        }else{
            halfCircleTop.style.opacity = "1";
        }
    });

     scrollBool = scrolledPortion + pageViewportHeight === pageHeight;

    //Arrow rotation
    if(scrollBool){
        progressBarCircle.style.transform = "rotate(180deg)";
    }else{
        progressBarCircle.style.transform = "rotate(0)";
    }
    //end of arrow rotation
};

//progressbar click
progressBar.addEventListener("click",e =>{
    e.preventDefault();

    if(!imageWrapper){
        const sectionPositions = Array.from(sections).map(
            (section) => scrolledPortion+section.getBoundingClientRect().top);
        // console.log(sectionPositions);

        const position = sectionPositions.find(
            (sectionPosition)=>{
                return sectionPosition>scrolledPortion;
            });

        scrollBool ? window.scrollTo(0,0) : window.scrollTo(0,position);

    }else{
        scrollBool ? imageWrapper.scrollTo(0,0):imageWrapper.scrollTo(0,imageWrapper.scrollHeight);
    }
    // console.log(position);
});
//end of progress click

progressBarFn();
//end of progress bar

//Navigation
const menuIcon = document.querySelector(".menu-icon");
const navbar = document.querySelector(".navbar");

const scrollFn = () =>{
    menuIcon.classList.add("show-menu-icon");
    navbar.classList.add("hide-navbar");

    if(window.scrollY === 0){
        menuIcon.classList.remove("show-menu-icon");
        navbar.classList.remove("hide-navbar");
    }

    progressBarFn();
}
document.addEventListener("scroll",scrollFn);

menuIcon.addEventListener("click",()=>{
    menuIcon.classList.remove("show-menu-icon");
    navbar.classList.remove("hide-navbar");
})
//End of Navigation

// About Me Text
const aboutMeText = document.querySelector(".about-me-text");
const aboutMeTextContent =
    "I am a master's student with computer science major and I have a solid Python Java and C++ foundation.\n" + "      \n" +
    "I am looking for Software Engineer internship && full time job. If you have some positions, please contact me :)\n"

Array.from(aboutMeTextContent).forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    aboutMeText.appendChild(span);

    // span.addEventListener("mouseenter", (e) => {
    //     e.target.style.cssText = "aboutMeTextAnim 10s infinite";
    // });
});
// End of About Me Text

//Projects
const container = document.querySelector(".container");
const projects = document.querySelectorAll(".project");
const projectHideBtn = document.querySelector(".project-hide-btn");

projects.forEach((project,i)=>{
    //subtract the height of project from the height of image scroll up - the top will be negative
    //go the negative 'top' pos -- looks like sliding down that's how the sliding effect shows
    project.addEventListener("mouseenter",()=>{
        // console.log('topimg '+project.firstElementChild.style.top);
        // console.log('toppro '+project.offsetHeight);
        project.firstElementChild.style.top = `-${project.
            firstElementChild.offsetHeight - project.offsetHeight + 20}px`;
        // console.log('topimgafter '+project.firstElementChild.style.top);
    });

    //when the mouse leave set top be positive number the image will go up
    project.addEventListener("mouseleave",()=>{
        project.firstElementChild.style.top = "2rem";
    });

    //big Project Image
    if(i != 1){
    project.addEventListener('click',()=>{
        const bigImgWrapper = document.createElement("div");
        bigImgWrapper.className = "project-img-wrapper";
        container.appendChild(bigImgWrapper);

        const bigImg = document.createElement("img");
        bigImg.className = "project-img";
        const imgPath = project.firstElementChild.getAttribute("src").split(".")[0];

        bigImg.setAttribute("src",`${imgPath}-big.jpg`);
        bigImgWrapper.appendChild(bigImg);
        //hid the scroll bar for the image
        document.body.style.overflowY = "hidden";

        document.removeEventListener("scroll",scrollFn);

        mouseCircle.style.opacity = 0;

        progressBarFn(bigImgWrapper);

        bigImgWrapper.onscroll = () =>{
            progressBarFn(bigImgWrapper);
        }

        projectHideBtn.classList.add("change");

        projectHideBtn.onclick = () =>{
            projectHideBtn.classList.remove("change");
            bigImgWrapper.remove();
            document.body.style.overflowY = "scroll";

            document.addEventListener("scroll",scrollFn);
            progressBarFn();
        }
    });}
    if(i == 1){
        project.addEventListener('click', (qualifiedName, value)=>{
        const bigImgWrappers = document.createElement("div");
        bigImgWrappers.className = "project-img-wrapper";
        container.appendChild(bigImgWrappers);
        const bigVideo = document.createElement("video");
        bigVideo.className = "project-video";
        const source = document.createElement("source");

        const VideoPath = project.firstElementChild.getAttribute("src").split(".")[0];
        console.log(VideoPath);
        source.setAttribute("src",`${VideoPath}-big.mp4`);
        source.setAttribute("type", "video/mp4");
        bigVideo.setAttribute("width", "1444");
        bigVideo.setAttribute("height","960");
        bigVideo.setAttribute("muted",value);
        bigVideo.setAttribute("controls", value);

        bigVideo.appendChild(source);
        bigImgWrappers.appendChild(bigVideo);
        bigVideo.muted = true;
        document.body.style.overflowY = "hidden";
        document.removeEventListener("scroll",scrollFn);
        mouseCircle.style.opacity = 0;
        progressBarFn(bigImgWrappers);

        bigImgWrappers.onscroll = () =>{
            progressBarFn(bigImgWrappers);
        }

        projectHideBtn.classList.add("change");

        projectHideBtn.onclick = () =>{
            projectHideBtn.classList.remove("change");
            bigImgWrappers.remove();
            document.body.style.overflowY = "scroll";

            document.addEventListener("scroll",scrollFn);
            progressBarFn();
        }
    })}

    //End of big Project Image
    i>=6 && (project.style.cssText = "display:none; opacity:0");
});


//projects button
const section3 = document.querySelector(".section-3");
const projectsBtn = document.querySelector(".projects-btn");
let showHideBool = true;
const projectsBtnText = document.querySelector(".projects-btn span");

const showProjects = (project,i) => {
    setTimeout(()=>{
        project.style.display = "flex";
        section3.scrollIntoView({block:"end"});
    },600);

    setTimeout(() =>{
        project.style.opacity = "1";
    },i*200);
}

const hideProjects = (project,i) => {
    setTimeout(()=>{
        project.style.display = "none";
        section3.scrollIntoView({block:"end"});
    },1200);

    setTimeout(() =>{
        project.style.opacity = "0";
    },i*100);
}

projectsBtn.addEventListener("click",(e)=>{
    e.preventDefault();

    projectsBtn.firstElementChild.nextElementSibling.classList.toggle("change");

    showHideBool?(projectsBtnText.textContent = "Show Less"):(projectsBtnText.textContent = "Show More");

    projects.forEach((project,i)=>{
        i >= 6 && (showHideBool ? showProjects(project,i):hideProjects(project,i))
    });
    showHideBool = !showHideBool;
});
//end of projects button
//End of Projects

//section 4
document.querySelectorAll('.service-btn').forEach(service=>{
    service.addEventListener("click",(e)=>{
        e.preventDefault();
        const serviceText = service.nextElementSibling
        serviceText.classList.toggle("change");

        const rightPosition = serviceText.classList.contains("change") ?
            `calc(100% - ${getComputedStyle(service.firstElementChild).width})`
            :0;

            service.firstElementChild.style.right = rightPosition;
    });
});
//End of section 4

//section 5
//Form
const formHeading = document.querySelector(".form-heading");
const formInputs = document.querySelectorAll(".contact-form-input");

formInputs.forEach((input)=>{
    input.addEventListener("focus",()=>{
        formHeading.style.opacity = "0";
        setTimeout(()=>{
            formHeading.textContent = `Your ${input.placeholder}`;
            formHeading.style.opacity = "1";
        },300);
    });

    input.addEventListener("blur",()=>{
        formHeading.style.opacity = "0";
        setTimeout(()=>{
            formHeading.textContent = "Let's Talk";
            formHeading.style.opacity = "1";
        },300);
    });
});
//End of Form

//slideShow
const slideShow = document.querySelector(".slideshow");

setInterval(()=>{
    const firstIcon = slideShow.firstElementChild;

    firstIcon.classList.add("faded-out");

    const thirdIcon = slideShow.children[3];

    thirdIcon.classList.add("light");

    thirdIcon.previousElementSibling.classList.remove("light");


    setTimeout(()=>{
        slideShow.removeChild(firstIcon);

        slideShow.appendChild(firstIcon);

        setTimeout(()=>{
            firstIcon.classList.remove("faded-out");
        },500);
    },500);
},3000);
//end of slideShow

//form Validation
const form = document.querySelector(".contact-form");
const username = document.getElementById("name");
const email = document.getElementById("email");
const subject = document.getElementById("subject");
const message = document.getElementById("message");

const messages = document.querySelectorAll(".message");

const error = (input, message) => {
    input.nextElementSibling.classList.add("error");
    input.nextElementSibling.textContent = message;
};

const success = (input) =>{
    input.nextElementSibling.classList.remove("error");
}

const checkRequiredFields = (inputAll) =>{
        inputAll.forEach(input =>{
            if(input.value.trim() ===""){
                error(input,`${input.id} is required`);
            }
        });
};

const checkLength = (input,min) =>{
    if(input.value.trim().length<min){
        error(input,`${input.id}must be at least ${min} characters`);

    }else{
        success(input);
    }
}

const checkEmail = (input) =>{
    const regEx =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (regEx.test(input.value.trim())) {
        success(input);
    } else {
        error(input, "Email is not valid");
    }
}

form.addEventListener("submit", e=>{


    checkLength(username,2);
    checkLength(subject,2);
    checkLength(message,10);
    checkEmail(email);
    checkRequiredFields([username,email,subject,message]);

    const notValid = Array.from(messages).find(message=>{
        return message.classList.contains("error")
    });

    notValid && e.preventDefault();
})


//end of form Validation
//End of section 5