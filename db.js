'use strict'
const tool = require("./config");

exports.findWarehouseAll = () => {
    let _sql = `select * from _sys_t_data_warehouse where IDX > 0;`;
    return tool.queryEhz(_sql)
};

exports.findWarehouseMaxIdx = () =>{
    let _sql = `select max(IDX) maxIndex from _sys_t_data_warehouse;`;
    return tool.queryEhzos( _sql )
};

exports.insertWarehourse = ( data ) =>{
    let _sql = `insert into _sys_t_data_warehouse values (null,${data.parent},${data.layer},"${data.nodeidPath}","${data.nodeNamePath}",
    "${data.NewNodeid}","${data.nodeType}","${data.nodeName}","${data.nodeExplain}","${tool.standardCurrDatetime()}",null);`;
    return tool.queryEhzos( _sql )
};

exports.findDataConfig = (data) => {
    let _sql = `select * from _sys_t_data_config where nodeid = '${data}';`;
    return tool.queryEhz( _sql )
};

exports.findDataConfigMaxIdx = () =>{
    let _sql = `select max(IDX) maxIndex from _sys_t_data_config;`;
    return tool.queryEhzos( _sql )
};

exports.insertDataConfig = ( data ) =>{
    let _sql = `insert into _sys_t_data_config values (null,"${data.NewNodeid}",${data.modelid},"${data.name}","${data.oid}",
    ${data.class1},${data.class2},${data.class3},${data.dataType},${data.enumTable},${data.maxValue},${data.minValue},
    ${data.accessRight},${data.setLogEnable},${data.alarmGrade},${data.storageEnable},${data.storageCycle},
    ${data.storageAbsoluteThreshold},${data.trapThreshold},${data.defaultValue},"${data.unit}",${data.disable},
    "${data.explain}","${tool.standardCurrDatetime()}","${data.relationHost}", "${data.relationModule}");`;
    return tool.queryEhzos( _sql )
};

exports.findRealTimeData = (data) => {
    let _sql = `select * from _sys_t_realtime_data where oid = '${data}';`;
    return tool.queryEhz( _sql )
};

exports.findRealTimeDataMaxIdx = () =>{
    let _sql = `select max(IDX) maxIndex from _sys_t_realtime_data;`;
    return tool.queryEhzos( _sql )
};

exports.insertRealtimeData = ( data ) =>{
    let _sql = `insert into _sys_t_realtime_data values (null,"${data.NewNodeid}",${data.modelid},"${data.oid}",
    ${data.dataType},${data.value},${data.oldValue},${data.quality},"${tool.standardCurrDatetime()}");`;
    return tool.queryEhzos( _sql )
};

exports.findResourceAll = () => {
    let _sql = `select * from _sys_t_resource_manage where IDX > 0;`;
    return tool.queryEhz( _sql )
};

exports.findResourceMaxIdx = () =>{
    let _sql = `select max(IDX) maxIndex from _sys_t_resource_manage;`;
    return tool.queryEhzos( _sql )
};

exports.findAttrData = (data) => {
    let _sql = `select * from _sys_t_resource_model_attr_data where rid = '${data}';`;
    return tool.queryEhz( _sql )
};

exports.insertAttrData = (data) => {
    let _sql = `insert into _sys_t_resource_model_attr_data values (null,${data.NewRid},"${data.groupid}","${data.groupName}",
    "${data.attrid}","${data.attrName}",${data.attrType},${data.attrValue},${data.depends},${data.attrExplain},null,null,null,null,null);`;
    return tool.queryEhzos( _sql )
};

exports.findBindData = (data) => {
    let _sql = `select * from _sys_t_resource_model_bind_data where rid = '${data}';`;
    return tool.queryEhz( _sql )
};

exports.insertBindData = (data) => {
    let _sql = `insert into _sys_t_resource_model_bind_data values (null,${data.NewRid},"${data.id}","${data.name}",
    "${data.pathName}",${data.type},"${data.host}","${data.nodeid}","${data.oid}",${data.priority},${data.value},"${data.explain}");`;
    return tool.queryEhzos( _sql )
};

exports.findRoleData = (data) => {
    let _sql = `select * from _sys_t_rights_of_role_rtree where rid = '${data}';`;
    return tool.queryEhz( _sql )
};

exports.insertRoleData = (data) => {
    let _sql = `insert into _sys_t_rights_of_role_rtree values (null,${data.roleid},${data.NewRid},${data.rights_onlyRead},
    ${data.rights_addEditDelete},${data.rights_parameterSet},${data.rights_alarmOperation});`;
    return tool.queryEhzos( _sql )
};

exports.insertResourceData = (data) => {
    let _sql = `insert into _sys_t_resource_manage values (null,${data.NewRid},${data.parent},${data.layer},"${data.name}",
    ${data.type},${data.grade},"${data.explain}","${tool.standardCurrDatetime()}",${data.alarmCount},${data.alarmStatistics},${data.icoPath},"${data.templateType}",
    ${data.tplM2LF_x},${data.tplM2LF_y},${data.tplM2LF_width},${data.tplM2LF_height},${data.tplM2LA_frame},
    ${data.tplM2LA_type},"${data.tplM2LE_moduleName}",${data.tplM2LE_mode},${data.templatePrivateDatas});`;
    console.log("!-------------------",_sql)
    return tool.queryEhzos( _sql )
};

exports.findConfigData = (data) => {
    let _sql = `select * from _sys_t_data_config where oid = '${data}';`;
    return tool.queryEhzos( _sql )
};