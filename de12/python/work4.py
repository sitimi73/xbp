for i in range(1,4): #コロンが入っていることに注意
    print(i,"人目") #タブでずらしていることに注意！
    name=input("名前を教えてください")
    waist=float(input("福井は？"))
    age=float(input("年齢は？"))
    food=5
    print(name, "さんは腹囲", waist, "cmで年齢は",age, "才、一日",food,"食ですね。")
    if waist>=85 and age>=40:
        print(name,"さん、太ってるおっさんです")
    else:
        print(name,"さん、太ってない男です")






# 出力結果
# 0 人目
# 1 人目
# 2 人目
