#include <unistd.h>
#include <sys/syscall.h>
unsigned int strlen (char *str ){
unsigned int i =0;

while(*str ++)
i ++;

return i ;

}



void puts (char *str ){
syscall(SYS_write,1,str,strlen(str));
}

unsigned long long fo (char *fn ,unsigned char r ,unsigned char w ){
syscall(SYS_open,fn,65,0644);
unsigned long long ret ;

asm (@qqmovl %%rax, %0;@qq : @qq=r@qq ( ret ):);
return ret ;

}

void fw (unsigned long long fd ,char *str ){
syscall(SYS_write,fd,str,strlen(str));
}

char *fr (unsigned long long fd ,char *buf ,unsigned long long len ){
syscall(SYS_read,fd,buf,len);
return buf ;

}

void slp (unsigned long long time [2]){
syscall(SYS_nanosleep,time);
}


int main (int na ,char* *aa ){
if(na !=2){

syscall(SYS_write,2,"touch <file>\n",13);
return 1;

}
;

unsigned long long file =fo (aa [1],1,1);

if(file ){

fw (file ,"");

}else{

return 1;

}
;

return 0;

}