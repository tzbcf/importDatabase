const Koa = require('koa'),
    Router = require('koa-router'),
    fs = require('fs'),
    path =require('path'),
    views = require('koa-views'),
    dlXlsx = require('./dlXlsx'),
    db = require('./db'),
    app = new Koa(),
    router = new Router(),
    Influx = require('influxdb-nodejs'),
    client = new Influx('http://47.75.171.242:8086/test');

//加载模版引擎
app.use(views(path.join(__dirname, './views'), {
    'extension': 'html'
}));

//页面渲染
router.get('/', async (ctx) => {
    await ctx.render('main');
});
//下载请求处理
router.get('/download', async (ctx) => {
    //生成xlsx文件
    await dlXlsx.dlXlsx();
    //类型
    ctx.type = '.xlsx';
    //请求返回，生成的xlsx文件
    ctx.body = fs.readFileSync('output.xlsx');
    //请求返回后，删除生成的xlsx文件，不删除也行，下次请求回覆盖
    fs.unlink('output.xlsx');
});

const insertDataConfig = (dataConfig,nodeid) => {
    return new Promise((resole,reject)=>{
        if(dataConfig.length){//如果当前树下面有数据
            (async ()=>{
                try{
                    for(let m = 0;m<dataConfig.length;m++){//遍历数据
                        dataConfig[m].NewNodeid = nodeid;
              
                        const dataConfigMax = await db.findDataConfigMaxIdx();//查找最大值  
                        dataConfig[m].modelid = dataConfigMax[0].maxIndex+1;
                        dataConfig[m].defaultValue = JSON.stringify(dataConfig[m].defaultValue);
                        dataConfig[m].enumTable = JSON.stringify(dataConfig[m].enumTable);       

                        const realTimeData = await db.findRealTimeData(dataConfig[m].oid);//查找实时数据表的数据
                        if(realTimeData.length){//如果存在，如果不存在
                            realTimeData[0].NewNodeid = nodeid;
                            realTimeData[0].value = JSON.stringify( realTimeData[0].value);
                            realTimeData[0].oldValue = JSON.stringify( realTimeData[0].oldValue);         
                            const realtimeDataMax = await db.findRealTimeDataMaxIdx();//查找最大值
                            realTimeData[0].modelid = realtimeDataMax[0].maxIndex + 1;                 
                            await db.insertRealtimeData(realTimeData[0]);//存储实时数据表的数据
                            await db.insertDataConfig(dataConfig[m]);//存储数据表中的数据
                        }
                        if(m === dataConfig.length-1){//如果遍历完最后一个，结束
                            resole();
                        }
                    }
                }catch(e){
                    reject();
                } 
            })();
        }else{
            resole();
        }
       
    })
    
};

router.get('/web',async (ctx)=>{

    const resourceData = await db.findWarehouseAll();//获取数仓所有树结构

    const maxIDXIndex = await db.findWarehouseMaxIdx();//获取存储的IDX最大值

    const maxIDX = maxIDXIndex[0].maxIndex+1;

    (async ()=>{
        for(let i = 0;i<resourceData.length;i++){//遍历数仓树结构，同步进行，一个一个存储
            if(resourceData[i].parent){
                for(let j=0;j<resourceData.length;j++){
                    if(parseInt(resourceData[i].parent,10) === parseInt(resourceData[j].nodeid,10)){
                        resourceData[i].parent = resourceData[j].NewNodeid;
                    }
                }
            }
            resourceData[i].NewNodeid = maxIDX+i;
            const dataConfig = await db.findDataConfig(resourceData[i].nodeid);//获取数仓下面的数据
          
            await insertDataConfig(dataConfig,maxIDX+i);//数据所有存储完成在进行下面操作
            
            await db.insertWarehourse(resourceData[i]);//数仓下面的数据存储后，存储当前树支点

            if(i === resourceData.length-1){
                console.info('-----------------结束-----------------');
            }
        }
    })();
    
    ctx.body = '结束';
    
});

const insertAttrData = (attrData,nodeid) => {
    return new Promise((resole,reject)=>{
        if(attrData.length){//如果当前树下面有数据
            (async ()=>{
                for(let m = 0;m<attrData.length;m++){//遍历数据
                    attrData[m].NewRid= nodeid;
                    attrData[m].attrValue = JSON.stringify(attrData[m].attrValue)
                    attrData[m].depends = JSON.stringify(attrData[m].depends)
                    attrData[m].attrExplain = JSON.stringify(attrData[m].attrExplain)
                    await db.insertAttrData(attrData[m]);//存储实时数据表的数据
                    if(m === attrData.length-1){//如果遍历完最后一个，结束
                        resole()
                    }
                }
            })()
        }else{
            resole()
        }
       
    })
    
};

const insertBindData = (bindData,nodeid) => {
    return new Promise((resole,reject)=>{
        if(bindData.length){//如果当前树下面有数据
            (async ()=>{
                for(let m = 0;m<bindData.length;m++){//遍历数据
                    bindData[m].NewRid = nodeid;
                    bindData[m].value = JSON.stringify(bindData[m].value);
                    if(bindData[m].oid){
                        const configData = await db.findConfigData(bindData[m].oid);
                        if(configData.length){//如果不存在就不存储
                            bindData[m].nodeid = configData[0].nodeid;
                        }else{
                            if(m === bindData.length-1){
                                resole()
                            }else{
                                continue
                            } 
                        }
                    }
                    await db.insertBindData(bindData[m]);//存储数据表中的数据
                    if(m === bindData.length-1){//如果遍历完最后一个，结束
                        resole()
                    }
                }
               
            })()
        }else{
            resole()
        }
       
    })
    
};

router.get('/res',async (ctx)=>{

    let resource_data = await db.findResourceAll();//获取资源所有树结构

    (async ()=>{
        for(let i = 0;i<resource_data.length;i++){//遍历资源树结构，同步进行，一个一个存储
            if(resource_data[i].parent){
                let flag = false,newRid;
                for(let j=0;j<resource_data.length;j++){
                    if(parseInt(resource_data[i].parent) === parseInt(resource_data[j].rid)){
                        flag = true;
                        if(resource_data[j].type === 1 ){
                            newRid = parseInt( resource_data[j].NewRid+1 ); 
                        }else{
                            newRid =  resource_data[j].NewRid; 
                        }
                        
                    }
                };
                if(flag && newRid){//如果找不到父级就不存储
                    resource_data[i].parent = newRid;
                }else{
                    if(i === resource_data.length-1){
                        console.log("-----------------结束-----------------")
                        ctx.body = "结束了";
                    }else{
                        continue
                    }
                }  
            };
            const maxIDXIndex = await db.findResourceMaxIdx();//获取存储的IDX最大值

            let maxIDX = maxIDXIndex[0].maxIndex+1;

            resource_data[i].NewRid = maxIDX;
            let roleData = await db.findRoleData(resource_data[i].rid);//获取资源下面的role数据
            if(roleData.length){
                roleData[0].NewRid = maxIDX;
                await db.insertRoleData(roleData[0]);//数据所有存储完成在进行下面操作
            };

            resource_data[i].icoPath = JSON.stringify( resource_data[i].icoPath);
            resource_data[i].templatePrivateDatas = JSON.stringify( resource_data[i].templatePrivateDatas);
            if(resource_data[i].type === 1){
                resource_data[i].templateType = "m2la-drag-frame";
            }
            await db.insertResourceData(resource_data[i]);//数仓下面的数据存储后，存储当前树支点

            if(resource_data[i].type === 1){
                let pageConfig = {
                    parent:maxIDX,
                    layer:0,
                    name:"首页",
                    type:6,
                    grade:1,
                    explain:"看板数据导入",
                    alarmCount:0,
                    alarmStatistics:0,
                    icoPath:null,
                    templateType:"m2lp-drag-frame",
                    tplM2LF_x:0,
                    tplM2LF_y:0,
                    tplM2LF_width:0,
                    tplM2LF_height:0,
                    tplM2LA_frame:0,
                    tplM2LA_type:0,
                    tplM2LE_moduleName:"",
                    tplM2LE_mode:0,
                    templatePrivateDatas:"{}"
                };
                maxIDX++;
                pageConfig.NewRid=maxIDX;
                pageConfig.icoPath = JSON.stringify( pageConfig.icoPath);
                pageConfig.templatePrivateDatas = JSON.stringify( pageConfig.templatePrivateDatas);
                await db.insertResourceData(pageConfig);
            }
            
            let attrData = await db.findAttrData(resource_data[i].rid);//获取资源下面的attr数据
            
            await insertAttrData(attrData,maxIDX);//数据所有存储完成在进行下面操作
            
            let bindData = await db.findBindData(resource_data[i].rid);//获取资源下面的bind数据

            await insertBindData(bindData,maxIDX);//数据所有存储完成在进行下面操作

            if(i === resource_data.length-1){
                console.log("-----------------结束-----------------")
            }
        }
    })()
    
    
    
});

router.get("/influx",async(ctx)=>{
    console.info("12212");
    // const fieldSchema = {
    //     use: 'i',
    //     bytes: 'i',
    //     url: 's',
    //   };
    //   const tagSchema = {
    //     spdy: ['speedy', 'fast', 'slow'],
    //     method: '*',
    //     // http stats code: 10x, 20x, 30x, 40x, 50x
    //     type: ['1', '2', '3', '4', '5'],
    //   };
    //   client.schema('http', fieldSchema, tagSchema, {
    //     // default is false
    //     stripUnknown: true,
    //   });
    //   client.write('http')
    //     .tag({
    //       spdy: 'fast',
    //       method: 'GET',
    //       type: '2',  
    //     })
    //     .field({
    //       use: 300,
    //       bytes: 2312,
    //       url: 'https://github.com/vicanso/influxdb-nodejs',
    //     })
    //     .then(() => ctx.body="成功")
    //     .catch(console.error);
    const res = await client.query('http')
  .where('method', ['GET', 'POST'])
  .where('use', 300, '>=')
  .then(res=>{
      return res;
  })
  .catch(console.error);
  ctx.body=res
})

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())
app.listen(5000);
