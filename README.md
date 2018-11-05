## 此為測試 ipfs + ethereum 以 react 為 ui 的 repo
## [build-a-simple-ethereum-interplanetary-file-system-ipfs-react-js-dapp](https://itnext.io/build-a-simple-ethereum-interplanetary-file-system-ipfs-react-js-dapp-23ff4914ce4e)

## install
 > npm install

## start
 > npm start  
 > visit `localhost:3000`
 
### deploy info
 > 測試時 contract 是部署在 `Rinkeby Test Network`、用的是 `account 1`

照我的理解，我玩的步驟應該是。
1. 先用 remix 部署一個 contract 上去
2. ipfs 已經指定好 node
3. 透過 (react) UI 來選檔案，傳到 ipfs 上面，這時候會拿到 ipfs hash
4. 把 ipfs 的 hash 透過 contract 的 sendHash 把 hash 存到 contract 裡面。

另外可以取回 txReceipt 來看。

![image info](./assets/001.png)


## cat
 成功用這指令 cat 下來了。
 > ipfs cat /ipfs/QmUu7vcP62sLriMg61a7FDUwSrMfwXKjuGS27Lf6WqjGoC >test.mp3
