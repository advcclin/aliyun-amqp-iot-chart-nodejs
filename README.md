# aliyun-amqp-iot-chart-nodejs
### Set your aliyun configuration in app.js.
<pre><code>
const ali_amqp_config = {
    'host': 'YourHost',
    'port': 5671,
    'transport':'tls',
    'reconnect':true,
    'idle_time_out':60000,
    'username':'YourClientId|authMode=aksign,signMethod=hmacsha1,timestamp='+cur_timestamp+',authId=YourAccessKeyId,consumerGroupId=YourConsumerGroupId|',
    'password': hmacSha1('YourAccessKeySecret', 'authId=YourAccessKeyId&timestamp='+cur_timestamp),
};
</code></pre>

#### YourHost
${uid}.iot-amqp.${regionId}.aliyuncs.com
   * ${uid} The ID of your Alibaba Cloud account
   * ${resionId} The ID of the region where IoT Platform resides
#### YourClientId
The client ID. You must use a unique identifier, such as the UUID, MAC address, or IP address of the client.
#### YourConsumerGroupId
The ID of the consumer group. You can view the IDs of your consumer groups in the IoT Platform console. 
#### YourAccessKeyId & YourAccessKeySecret
Log on to the Alibaba Cloud Management Console, move the pointer over the profile picture, and then click AccessKey Management. On the AccessKey Management page, you can view the AccessKey pair.

[Connect an AMQP client to IoT Platform:Configurations](https://www.alibabacloud.com/help/doc-detail/142489.htm?spm=a2c63.p38356.879954.4.411272f41wtKvI#section-3k8-hw3-oid)

Change EdgeX export option.
<pre>
"format":"ALI_JSON" -> "format":"JSON"
</pre>
