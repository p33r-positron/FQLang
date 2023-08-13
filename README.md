# FQLang

Somewhat a programming langage, tried to make one that isn't based of english (or latin more generally).  
It doesn't work rn, I need to fix it. Yay !  

# Documentation

## Types (Latin)

The types are the same as C, but with groucho glasses.  
  
  
|ASM|        C          | FQLang |
|---|-------------------|--------|
|db |   unsigned char   |   u8   |
|db |    signed char    |   i8   |
|dw |   unsigned short  |   u16  |
|dw |   signed short    |   i16  |
|dd |   unsigned int    |   u32  |
|dd |    signed int     |   i32  |
|dq |unsigned long long |   u64  |
|dq | signed long long  |   i64  |

## Keywords (Latin)

The latin keyword alphabet is a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z.  
The notion of keyword alphabet is only for \<letter\>= keywords, for now you'll still have to use f for functions.  
  
| Keyword |     What it does    |                  Usage                     |
|---------|---------------------|--------------------------------------------|
|   a=    |   Inline Assembly   | Like GCC's but with a=X; instead of asm(X);|
|   b=    | Includes Local File |               b="somefile.fq";             |
|   c=    |      Raw C Code     |       c="printf(\\"Hello from C !\\")";    |
|   d=    |     Not Defined     |  |
|   e=    |       Execute       | Includes result of a shell command: e="echo int a = 1;";  |
|   f     |      Functions      |      i32 square = f (i32 x) { f= x*x }     |
|   f=    |Returns from function|      i32 square = f (i32 x) { f= x*x }     |
|   g=    |     Not Defined     |  |
|   h=    |     Not Defined     |  |
|   i=    | Changes IP (= Goto) |                  i=label                   |
|   j=    |     Not Defined     |  |
|   k=    |     Not Defined     |  |
|   l=    |  Includes Library   |               l="string.fq"                |
|   m=    |     Not Defined     |  |
|   n=    |     Not Defined     |  |
|   o=    |     Not Defined     |  |
|   p=    |     Not Defined     |  |
|   q=    |     Not Defined     |  |
|   r=    |     Not Defined     |  |
|   s=    |       Syscall       |s=1, 1, "Hello\n", 5//Prints Hello to stdout|
|   t=    |     Not Defined     |  |
|   u=    |     Not Defined     |  |
|   v=    |     Not Defined     |  |
|   w=    |     Not Defined     |  |
|   x=    |     Not Defined     |  |
|   y=    |     Not Defined     |  |
|   z=    |     Not Defined     |  |

## Blocks

### If, else

For this, you'll use the question marks operators: ¿?  
Now you may be wondering: ¿¡ Why are you using these, they aren't even on my keyboard !?  
Well, just copy and paste them lol  
  
C (or pretty much every langage made by sane people):  
```c
if(oui){
    oui();
}

if(yes){
    yes();
} else{
    no();
}

if(cond1){
    doThing1();
} else if(cond2){
    doThing2();
} else {
    doThing3();
}
```  
  
FQLang:  
```fqlang
¿oui?
    oui();
!;

¿yes?
    yes();
¡
    no();
!;

¿cond1?
    doThing1();
¡¿cond2?
    doThing2();
¡
    doThing3();
!!; //accumulate the exclamation points for each elseif because this langage is badly made
```  

## Arrays

¡ Hey, You ! ¿ Did you always wanted to save these precious deciseconds you lose by writing \[number\] after an array ?  
¡ Well, I have the solution for you !  
  
You know, this idiot rule that says you cannot start variable names by a digit ?  
Well, you can now put numbers before arrays names to get an element from them !  
E.g.: `array[1] += 2;` can be written as `1array += 2;` !  
But since I'm not *that* evil (Or maybe it's that I didn't find the way to stop it), you can still use the old way with square brackets.  



## Operators

Same as most programming langages: +, -, *,  /, %, &, |, ^...  
  
Now, for the ones specific to FQLang: :, ^^  

### :

The deux-point (call it whatever you want) operator can be used for little functions (like in JS), this code:  
```fqlang
i32 square = f(i32 x)
{
    f= x*x;
}
```  
Can be wrote as:  
```fqlang
i32 square = f(i32 x) : x*x;
```  

### ^^

The thing that nobody asked for but everybody needed: XOR for conditions !  
  
Usage:  
```fqlang
l="stdio.fq";
¿ condition1 ^^ condition2 ?
    puts("Either condition1 is true, either condition 2 is true, not both or neither.");
¡
    puts("All your bases are belong to us.");
!
```