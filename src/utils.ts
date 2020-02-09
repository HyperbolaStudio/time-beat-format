export function fillNumberWidth(num?:number,width?:number,fill?:number|string):string{
    if(!num)num = 0;
    if(!width)width = 0;
    if(!fill)fill = 0;
    if(width==-1&&num==0)return '';
    let s:string=num.toString();
    while(s.length<width){
        s=fill.toString()+s;
    }
    return s;
}
export function fixNumberWidth(num?:number,width?:number,fill?:number|string){
    if(!num)num = 0;
    if(!width)return num.toString();
    if(!fill)fill = 0;
    if(num.toString().length <= width){
        return fillNumberWidth(num,width,fill);
    }else{
        return Math.round(Number(num.toPrecision(width))).toString().slice(0,width);
    }
}