# SoftwareDesignChallenge

## Part 1
1) `char` is an integer type (not the actual 'int' type), usually representing the character data (value-) type. It holds one byte of data, and the value stored inside can be used to map the number to a character (eg. value 32 is a SPACE, 97 is 'a' etc.)

2) The `[]` brackets refer to the fact that it is an array. In this case, `char Address[]` states that the variable `Address` is of the type: character array.

3) 168

4) Change the index in the second line to:
```
printf("%d",AddressIP[1]);
```

## Question 
```
int main()
{
    unsigned char AddressIP[]={192,17,0,5};
    PrintIP(AddressIP);
}

void PrintIP(unsigned char AddressIP[]) {
    int i;
    
    //IPv4 always has 4 parts
    for( i = 0; i < 4; i++) {
        printf ("%d" , AddressIP[i]);
        if (i != 3) printf(".");
    }
}
```

## Question
- What is Const: Const refers to constant. A value that stays the same and cannot be modified after it has been initialized.

- Can you explain this treatment "(AddressIP>>24)&0xFF": `AddressIP` is the ip address initialized as the (hex) value A80C0005. Each combination of 2 hex values is stored as a byte (4 bits each). The `>>` is a bit-shift to the right, by 24 bits (6 hex-values to the right since 24/4 = 6). IE. the result of this is the value 0x000000A8. It also uses a mask of FF (from the right), which uses the (bitwise) AND operator. FF is essentially a set of 1s for the right-most 8 bits. Since the remainder of the numbers are 0, anything that does not fall under these right-most 8 bits will be set to 0 due to the AND operator. The resulting value will therefore be 0xA8, or 168 in decimal (ie. the first byte).

## Final Question

```
int main()
{
    GetList(0xA80C0005, 0xFFFFFFF0);
}

void GetList(unsigned long NetworkID, unsigned long SubnetMask) {
    //print network addresses
    unsigned char Byte1 = (NetworkID>>24)&0xFF;
    unsigned char Byte2 = (NetworkID>>16)&0xFF;
    unsigned char Byte3 = (NetworkID>>8)&0xFF;
    unsigned char Byte4 = (NetworkID)&0xFF;
    
    //calculate range over which to iterate
    unsigned long invertedSubnetMask = SubnetMask ^ 0xFFFFFFFF;
    
    //print the available addresses within the subnet
    long i;
    for( i = 1; i < invertedSubnetMask; i++) {
        printf("==> %d.%d.%d.%li\n" , Byte1, Byte2, Byte3, i);
    }
    
    //print the reserved host and broadcast addresses
    printf("==> Reserved\n");
    printf("==> %d.%d.%d.%li\n" , Byte1, Byte2, Byte3, 0);
    printf("==> %d.%d.%d.%li\n" , Byte1, Byte2, Byte3, invertedSubnetMask);
}
```
1) What is ==> 168.12.0.0: This is the host address (address of the local machine).
2) What is ==> 168.12.0.15: This is the broadcast address (sending messages to this address will forward the messages to all devices located within the subnet).
3) The function prints out the range of addresses available within the given network.