class Game{
    constructor(){
        this.framesGroup = document.getElementsByClassName("Frames")
        this.startStop = false;
        this.flagPos = 0;
        this.items = [
            {
                img:'url(/assets/image/prizes/bmw.png)',
                chance: 10,
                name: 'BMW',
                id: 0,
            },
            {
                img: 'url(/assets/image/prizes/ford.png)',
                chance: 15,
                name: 'Ford',
                id: 1,
            },
            {
                img: 'url(/assets/image/prizes/audi.png)',
                chance: 25,
                name: 'Audi',
                id: 2,
            },
            {
                img:'url(/assets/image/prizes/toyota.png)',
                chance: 50,
                name: 'Camry',
                id: 3,
            },   
        ]
        this.itemsOnFrame = this.fill();
    }

    getInfo(){
        return this.startStop;
    }

    updateFrame(elem, xPos){
        elem.style.left = (xPos+(740 + 160  )).toString() + "px";
    }  

    move(speed, stage = 0, itemId){
        for(let i = 0; i<this.framesGroup.length; i++){
            
            let computedStyle = window.getComputedStyle(this.framesGroup[i]);
            let xPosition = parseInt(computedStyle.left) || 0;
            this.framesGroup[i].style.left = (xPosition - speed) + "px";
            
            if(this.framesGroup[i].getBoundingClientRect().right < this.mainPositions.mainLeftPos){this.updateFrame(this.framesGroup[i], xPosition)}
            if(stage && (this.mainPositions.selecterXpos > this.framesGroup[itemId].getBoundingClientRect().left 
                && this.framesGroup[itemId].getBoundingClientRect().right >= this.mainPositions.selecterXpos)){
                    const rnd = Math.floor(0 + Math.random() * (2)) ;
                    this.coldown = !rnd? 500: 0;
                    return rnd? true: false;
            }
        }
    }

    fill(){
        let rndImg = [0, 1, 2, 3, Math.floor(Math.random() * (4))];
        let items = [];
        for(let i = 0; i<this.framesGroup.length; i++){
            const pos = Math.floor(Math.random() * (rndImg.length));
            this.framesGroup[i].style.backgroundImage = this.items[rndImg[pos]].img;
            items[i] = rndImg[pos];
            rndImg.splice(pos,1);
        }
        return items;
    }

    rndFunc(rnd){
        for(let i = this.items.length -1; i >= 0; i-- ){
            if((i === this.items.length-1? 100: this.items[i+1].chance) >= rnd && rnd > (i===0? 0: this.items[i].chance)){
                return this.items[i].id;
            }
        }
    }
    
    start(){
        
        this.mainPositions = {
            selecterXpos: document.getElementById("selecter").getBoundingClientRect().left,
            mainLeftPos: document.getElementById("game").getBoundingClientRect().left,
        }
        const openedItemId = this.rndFunc(Math.floor(Math.random()*100));
        const openedItemPos = this.itemsOnFrame.indexOf(openedItemId);
        
        this.startStop = true;
        let kd = false;
        let speed = 20;
        let stage = 0;
        this.opening = setInterval(()=>{
            const stop = this.move(speed, stage, openedItemPos)
            if(stop){clearInterval(this.opening); openMM(this.items[openedItemId].img);}
            if(!kd && speed > 4){setTimeout(()=>{speed-=4, kd = false}, 5000 ); kd = true; }
            else if(!kd && speed == 4 && !stage){
                this.startStop = false; 
                stage = 1; 
            }
        }, 20)
    }

    stop(){
        this.startStop = false
        clearInterval(this.opening)
    }
}

const startButton = document.getElementById('button')
const backButton = document.getElementById('backButton')
const modal = document.getElementById('modalMenu')
const roulette = new Game()
function back(){
    modal.style.display = 'none'
}
function start(){
    if(!roulette.getInfo()){roulette.start(); }
    else{roulette.stop(); }
}
function openMM(img){
    modal.style.display = 'block'
    document.getElementById('itemFrame').style.backgroundImage = img
}
startButton.addEventListener("click", start)
backButton.addEventListener("click", back)