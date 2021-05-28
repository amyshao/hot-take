# hot-take
A ranking platform for **hot** photos you **take** ie your instagram pics  
Get quick and easy feedback from friends! No login no hassle.  
Save yourself from that ugly profile pic. 

Link here: https://hot-take.herokuapp.com/  
  
Submitted as part of Shopify's Backend Internship Application Project 

## Instructions
1. Upload images one at a time by clicking ``Choose File`` or dragging and dropping near the button.  
2. Once all images are added, click ``Create Room``.  
3. In the new room you can drag and drop your preferred ranking of images, and click ``Submit`` when done.  
4. Share the link to your recruited rankers.  
5. Total scores are shown on the right.  

## Local Instance
Clone the repo
```
git clone https://github.com/amyshao/hot-take
```  
Build React frontend
```
cd client
npm install
npm run build
```
Run the Express server with React app
```
cd ..
npm install
npm start
```
Then go to ``localhost:3000``  

## Testing
API test suite using Mocha and Chai.  
To run tests, first make sure nothing is running on ``localhost:3000`` 
```
npm test
```
