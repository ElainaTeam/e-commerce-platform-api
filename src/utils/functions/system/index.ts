import { Snowflake } from 'nodejs-snowflake';

const uid = new Snowflake({
    custom_epoch: 19112021000,
    instance_id: undefined
});

function createSnowflakeId () {
    return uid.idFromTimestamp(Date.now()).toString()
}

export default {
    createSnowflakeId,
}