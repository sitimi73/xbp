a=1 
b=8
if a > 10 :
    print("10より大きい")
    print("10より小さい")

c=2
d=4

if a+b > c+d :
    print("かたつむり")
else:
    print("ナメクジ")


name=input("名前を教えてください")

waist=float(input("福井は？"))
age=float(input("年齢は？"))
food=5

print(name, "さんは腹囲", waist, "cmで年齢は",age, "才、一日",food,"食ですね。")

if waist>=85 and age>=40:
    print(name,"さん、太ってるおっさんです")
else:
    print(name,"さん、太ってない男です")