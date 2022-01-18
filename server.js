import express from "express"
import fs from "fs"
import cors from "cors"
import rateLimit from "express-rate-limit"

const port = process.env.PORT || 80
const mylink = "aea2-139-162-57-142.ngrok.io"
const app = express()
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
})
app.use(express.static("public"))
app.use(limiter)
app.use(cors())
// api key
const apikey = ["none"]
app.get("/", async (req, res) => {
    res.send("https://www.facebook.com/nguyen.thanh.chinhs")
})
app.get("/gai", (req, res) => {
    const result = {}
    
    result.code = 200
    const imageList = fs.readdirSync("./public/gai")
    const randomImage = imageList[Math.floor(Math.random() * imageList.length)]
    result.url = `${mylink}/gai/${randomImage}`
    result.author = "Citnut"
    result.source = "https://github.com/HELLSNAKES/image-random-api"
    res.header("Content-type", "application/json; charset=utf-8")
    res.send(JSON.stringify(result, null, 2))
})

app.get("/taixiu", async (req, res) => {
    const result = {}
    
    result.code = 200
    //const imageList = fs.readdirSync("./public/gai")
    //const randomImage = imageList[Math.floor(Math.random() * imageList.length)]
    //result.url = `${mylink}/gai/${randomImage}`
    result.author = "Citnut"
    res.header("Content-type", "application/json; charset=utf-8")
    //result.source = "https://github.com/HELLSNAKES/image-random-api"

    let bet = req.query.method
    let _bet = ["tai", "xiu", "chan", "le"]

    if (!_bet.includes(bet)) {
        const result = {
            "status": "api đang trong quá trình thử nghiệm còn nhiều chức năng chưa hoàn thiện",
            "method": {
                "xiu": 'Cược Xỉu: Sẽ thắng cược khi tổng số điểm của 3 xúc xắc là từ 4 đến 10. Trừ trường hợp đặc biệt khi kết quả của xúc xắc là "Bộ Ba Bất Kì"',
                "tai": 'Cược Tài: Sẽ thắng cược khi tổng số điểm của 3 xúc xắc là từ 11 đến 17. Trừ trường hợp đặc biệt khi kết quả của xúc xắc là "Bộ Ba Bất Kì"',
                "le": 'Cược Lẻ: Sẽ thắng cược khi tổng số điểm của 3 xúc xắc là 5,7,9,11,13,15,17 Trừ trường hợp đặc biệt khi kết quả của xúc xắc là "Bộ Ba Bất Kì"',
                "chan": 'Cược Chẵn: Sẽ thắng cược khi tổng số điểm của 3 xúc xắc là 4,6,8,10,12,14,16. Trừ trường hợp đặc biệt khi kết quả của xúc xắc là "Bộ Ba Bất Kì"'
            },
            "hd sử dụng":"https://aea2-139-162-57-142.ngrok.io/taixiu?method={method}"
        }
       
        res.send(JSON.stringify(result, null, 2))
    }
    let dice = {}
    async function taixiu() {
        let diceface = [1,2,3,4,5,6]

        dice.one = await diceface[Math.floor(Math.random() * diceface.length)]
        dice.two = await diceface[Math.floor(Math.random() * diceface.length)]
        dice.three = await diceface[Math.floor(Math.random() * diceface.length)]

        dice.total = await dice.one + dice.two + dice.three
        dice["bộ"] = `${dice.one}${dice.two}${dice.three}`
        dice["tên bộ"] = "không cược bộ"
            
        dice["chất"] = "không rõ"
        if (dice.total % 2 == 0){
            dice["chất"] = "chẵn"
        }else {
            dice["chất"] = "lẻ"
        }        
        switch (dice){
            case dice.one == dice.two == dice.three:
                dice["tên bộ"] = "bộ ba bất kì"
            break
            case dice.two == dice.three || dice.three == dice.one:
                dice["tên bộ"] = "bộ đôi đồng nhất"
            break
            case dice.one == dice.two || dice.two == dice.three || dice.three == dice.one:
                dice["tên bộ"] = "bộ đôi chính xác"
            break     
            default:
            break
        }

    }// `${}`
    
    await taixiu()

    let tai = [11,12,13,14,15,16,17]
    let xiu = [4,5,6,7,8,9,10]


    switch (bet) {
        case "tai":
            result.ketqua = "lose"
            if (tai.includes(dice.total) && dice["tên bộ"] != "bộ ba bất kì"){
                result.ketqua = "win"
            }
            result["mở bát"] = dice
            res.send(JSON.stringify(result, null, 2))
        break
        case "xiu":
            result.ketqua = "lose"
            if (xiu.includes(dice.total) && dice["tên bộ"] != "bộ ba bất kì"){
                result.ketqua = "win"
            }
            result["mở bát"] = dice
            res.send(JSON.stringify(result, null, 2))
        break
        case "chan":
            result.ketqua = "lose"
            if (dice["chất"] == "chẵn" && dice["tên bộ"] != "bộ ba bất kì") {
                result.ketqua = "win"
            }
            result["mở bát"] = dice
            res.send(JSON.stringify(result, null, 2))
        break
        case "le":
            result.ketqua = "lose"
            if (dice["chất"] == "lẻ" && dice["tên bộ"] != "bộ ba bất kì") {
                result.ketqua = "win"
            }
            result["mở bát"] = dice
            res.send(JSON.stringify(result, null, 2))
        break
        default:
        break
    }
    
    console.log(result)
})
app.listen(port, "0.0.0.0", function () {
    console.log(`Server listening on port ${port}\n`)
})
