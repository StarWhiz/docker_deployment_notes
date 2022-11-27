I use OvenMediaEngine + Radium Next to do sub-second latency streams from my OBS to my friends because discord stream quality sucks.

https://www.ovenmediaengine.com/about

https://github.com/zibbp/radium/tree/next 

A tip for this guide replace anything in the examples that says "stream.example.com" with your own desired subdomain.domainname.tld

### Minimum File Structure
```
/home/
└── ~/
    └── docker/
        └── ovenmediaengine/
            └── config
                ├── stream.example.com.crt
                ├── stream.example.com.key
                ├── Server.xml
            ├── docker-compose.yml
        └── radium-next/

            ├── docker-compose.yml     
```

Just create the directories for now. As you read further we will populate the other files. This is different from usual since we have two different services running. We need one directory for ovenmediaengine and one directory for raidum under the docker directory. You also want to create a subdirectory for ovenmediaengine called config.

### Add to Caddyfile (from ~/docker/caddy)
Remember to `docker exec -w /etc/caddy caddy caddy reload` after editing your Caddyfile.

```
stream.example.com {
	reverse_proxy radium-next:3000
}
```

### docker-compose.yml inside ovenmediaengine folder
*docker-compose.yml*
```
version: '3.3'
services:
  ovenmediaengine:
    image: 'airensoft/ovenmediaengine:0.14.14'
    container_name: ovenmediaengine
    ports:
      - '1935:1935'
      - '4000:4000/udp'
      - '3333:3333'
      - '3334:3334'
      - '3478:3478'
      - '9000:9000'
      - '9999:9999/udp'
    volumes:
      - ./config:/opt/ovenmediaengine/bin/origin_conf
    command: /opt/ovenmediaengine/bin/OvenMediaEngine -c origin_conf
```

### docker-compose.yml inside radium-next folder
```
version: "3.3"
services:
  radium:
    container_name: radium-next
#    ports:
#      - "3000:3000"
    environment:
      - "BASE_URL=https://stream.example.com"
      - INITIAL_SOURCE_TYPE=webrtc
      - INITIAL_SOURCE_URL=wss://stream.example.com:3334/app/stream
    image: ghcr.io/zibbp/radium:next

networks:
  default:
    external:
      name: caddy_net
```

### Copy your stream.example.com Caddy crts and keys to ovenmediaengine/config
Remember stream.example.com is just the example. You need to change it. To what you plan on using.

```
sudo cp ~/docker/caddy/data/caddy/certificates/acme-v02.api.letsencrypt.org-directory/stream.example.com/stream.example.com.crt ~/docker/ovenmediaengine/config/

sudo cp ~/docker/caddy/data/caddy/certificates/acme-v02.api.letsencrypt.org-directory/stream.example.com/stream.example.com.key ~/docker/ovenmediaengine/config/
```

### Create Server.xml inside ovenmediaengine/config folder
There are a couple of things you need to change in the default example Server.xml I included. And that's your stream.example.com and your TLS CertPath + KeyPath.


```
                        <!-- Settings for multi ip/domain and TLS -->
                        <Host>
                                <Names>
                                        <Name>stream.example.com</Name>
                                </Names>
                                <TLS>
                                        <CertPath>./stream.example.com.crt</CertPath>
                                        <KeyPath>./stream.example.com.key</KeyPath>
                                </TLS>
                        </Host>
```

*Server.xml*
```
<?xml version="1.0" encoding="UTF-8" ?>

<Server version="8">
	<Name>OvenMediaEngine</Name>
	<!-- Host type (origin/edge) -->
	<Type>origin</Type>
	<!-- Specify IP address to bind (* means all IPs) -->
	<IP>*</IP>
	<PrivacyProtection>false</PrivacyProtection>
	<!-- 
	To get the public IP address(mapped address of stun) of the local server. 
	This is useful when OME cannot obtain a public IP from an interface, such as AWS or docker environment. 
	If this is successful, you can use ${PublicIP} in your settings.
	-->
	<StunServer>stun.l.google.com:19302</StunServer>

	<Modules>
		<!-- 
		Currently OME only supports h2 like all browsers do. Therefore, HTTP/2 only works on TLS ports.			
		-->
		<HTTP2>
			<Enable>true</Enable>
		</HTTP2>

		<LLHLS>
			<Enable>true</Enable>
		</LLHLS>

		<!-- P2P works only in WebRTC and is experiment feature -->
		<P2P>
			<!-- disabled by default -->
			<Enable>false</Enable>
			<MaxClientPeersPerHostPeer>2</MaxClientPeersPerHostPeer>
		</P2P>
	</Modules>

	<!-- Settings for the ports to bind -->
	<Bind>
		<!-- Enable this configuration if you want to use API Server -->
		<!--
		<Managers>
			<API>
				<Port>${env:OME_API_PORT:8081}</Port>
				<WorkerCount>1</WorkerCount>
			</API>
		</Managers>
		-->
		<Providers>
			<!-- Pull providers -->
			<RTSPC>
				<WorkerCount>1</WorkerCount>
			</RTSPC>
			<OVT>
				<WorkerCount>1</WorkerCount>
			</OVT>
			<!-- Push providers -->
			<RTMP>
				<Port>${env:OME_RTMP_PROV_PORT:1935}</Port>
				<WorkerCount>1</WorkerCount>
			</RTMP>
			<SRT>
				<Port>${env:OME_SRT_PROV_PORT:9999}</Port>
				<WorkerCount>1</WorkerCount>
			</SRT>
			<MPEGTS>
				<!--
					Listen on port 4000
					This is just a demonstration to show that you can configure the port in several ways
					<Port>${env:OME_MPEGTS_PROV_PORT:4000-4001,4004,4005/udp}</Port>
				-->
				<Port>${env:OME_MPEGTS_PROV_PORT:4000/udp}</Port>
			</MPEGTS>
			<WebRTC>
				<Signalling>
					<Port>${env:OME_WEBRTC_SIGNALLING_PORT:3333}</Port>
					<TLSPort>${env:OME_WEBRTC_SIGNALLING_TLS_PORT:3334}</TLSPort>
					<WorkerCount>1</WorkerCount>
				</Signalling>
				<IceCandidates>
					<TcpRelay>${env:OME_WEBRTC_TCP_RELAY_ADDRESS:*:3478}</TcpRelay>
					<TcpForce>true</TcpForce>
					<TcpRelayWorkerCount>1</TcpRelayWorkerCount>
					<IceCandidate>*:10006/udp</IceCandidate>
				</IceCandidates>
			</WebRTC>
		</Providers>

		<Publishers>
			<!-- The OVT is protocol for ORIGIN-EDGE -->
			<OVT>
				<Port>${env:OME_ORIGIN_PORT:9000}</Port>
				<WorkerCount>1</WorkerCount>
			</OVT>
			<LLHLS>
				<!-- 
				OME only supports h2, so LLHLS works over HTTP/1.1 on non-TLS port. 
				Note that LLHLS runs higher performance over HTTP/2.
				Therefore, it is recommended to use TLS Port.
				-->
				<Port>${env:OME_LLHLS_STREAM_PORT:3333}</Port>
				<TLSPort>${env:OME_LLHLS_STREAM_TLS_PORT:3334}</TLSPort>
				<WorkerCount>1</WorkerCount>
			</LLHLS>
			<WebRTC>
				<Signalling>
					<Port>${env:OME_WEBRTC_SIGNALLING_PORT:3333}</Port>
					<TLSPort>${env:OME_WEBRTC_SIGNALLING_TLS_PORT:3334}</TLSPort>
					<WorkerCount>1</WorkerCount>
				</Signalling>
				<IceCandidates>
					<IceCandidate>*:10000-10005/udp</IceCandidate>
					<TcpRelay>${env:OME_WEBRTC_TCP_RELAY_ADDRESS:*:3478}</TcpRelay>
					<TcpForce>true</TcpForce>
					<TcpRelayWorkerCount>1</TcpRelayWorkerCount>
				</IceCandidates>
			</WebRTC>
		</Publishers>
	</Bind>

	<VirtualHosts>
		<!--
			You can include multiple XML files by doing the following:
			<VirtualHost include="sites-enabled/*.xml" />
		-->
		<VirtualHost include="VHost*.xml" />
		<VirtualHost>
			<Name>default</Name>
			<!--Distribution is a value that can be used when grouping the same vhost distributed across multiple servers. This value is output to the events log, so you can use it to aggregate statistics. -->
			<Distribution>ovenmediaengine.com</Distribution>
			
			<!-- Settings for multi ip/domain and TLS -->
			<Host>
				<Names>
					<Name>stream.example.com</Name>
				</Names>
				<TLS>
					<CertPath>./stream.example.com.crt</CertPath>
					<KeyPath>./stream.example.com.key</KeyPath>
				</TLS>
			</Host>

			<!-- Refer https://airensoft.gitbook.io/ovenmediaengine/signedpolicy
			<SignedPolicy>
				<PolicyQueryKeyName>policy</PolicyQueryKeyName>
				<SignatureQueryKeyName>signature</SignatureQueryKeyName>
				<SecretKey>aKq#1kj</SecretKey>

				<Enables>
					<Providers>rtmp,webrtc,srt</Providers>
					<Publishers>webrtc,hls,llhls,dash,lldash</Publishers>
				</Enables>
			</SignedPolicy>
			-->

			<!--
			<OriginMapStore>
				In order to use OriginMap, you must enable OVT Publisher in Origin and OVT Provider in Edge.
				<RedisServer>
					<Host>192.168.0.160:6379</Host>
					<Auth>!@#ovenmediaengine</Auth>
				</RedisServer>
				
				This is only needed for the origin server and used to register the ovt address of the stream. 
				<OriginHostName>ome-dev.airensoft.com</OriginHostName>
			</OriginMapStore>
			-->

			<!-- Settings for applications -->
			<Applications>
				<Application>
					<Name>app</Name>
					<!-- Application type (live/vod) -->
					<Type>live</Type>
					<OutputProfiles>
						<OutputProfile>
							<Name>bypass_stream</Name>
							<OutputStreamName>${OriginStreamName}</OutputStreamName>

							<!-- 
							You can provide ABR with Playlist. Currently, ABR is only supported in LLHLS.
							
							<Playlist>
								<Name>Paid</Name>
								You can play this playlist with 
								LLHLS : http[s]://<domain>[:port]/<app>/<stream>/<FileName>.m3u8 
								WebRTC : ws[s]://<domain>[:port]/<app>/<stream>/<FileName>
								Note that the keywords "playlist" and "chunklist" MUST NOT be included in FileName.
								<FileName>premium</FileName>

								Options is optional. 
								<Options>
									WebRtcAutoAbr : Default value is true
									<WebRtcAutoAbr>true</WebRtcAutoAbr> 
								</Options>

								<Rendition>
									<Name>bypass</Name>
									<Video>bypass_video</Video>
									<Audio>bypass_audio</Audio>
								</Rendition>
								<Rendition>
									<Name>480p</Name>
									<Video>480p</Video>
									<Audio>bypass_audio</Audio>
								</Rendition>
								<Rendition>
									<Name>720p</Name>
									<Video>720p</Video>
									<Audio>bypass_audio</Audio>
								</Rendition>
							</Playlist>
							<Playlist>
								<Name>free</Name>
								<FileName>free</FileName>
								<Rendition>
									<Name>720p</Name>
									<Video>720p</Video>
									<Audio>bypass_audio</Audio>
								</Rendition>
							</Playlist>
							-->

							<Encodes>
								<Audio>
									<Name>bypass_audio</Name>
									<Bypass>true</Bypass>
								</Audio>
								<Video>
									<Name>bypass_video</Name>
									<Bypass>true</Bypass>
								</Video>
								<Audio>
									<Codec>opus</Codec>
									<Bitrate>128000</Bitrate>
									<Samplerate>48000</Samplerate>
									<Channel>2</Channel>
								</Audio>
								<!-- 							
								<Video>
									<Name>video_1280</Name>
									<Codec>h264</Codec>
									<Bitrate>5024000</Bitrate>
									<Framerate>30</Framerate>
									<Width>1920</Width>
									<Height>1280</Height>
									<Preset>faster</Preset>
								</Video>
								<Video>
									<Name>video_720</Name>
									<Codec>h264</Codec>
									<Bitrate>2024000</Bitrate>
									<Framerate>30</Framerate>
									<Width>1280</Width>
									<Height>720</Height>
									<Preset>faster</Preset>
								</Video>
								-->
							</Encodes>
						</OutputProfile>
					</OutputProfiles>
					<Providers>
						<OVT />
						<WebRTC />
						<RTMP />
						<SRT />
						<RTSPPull />
						<MPEGTS>
							<StreamMap>
								<!--
									Set the stream name of the client connected to the port to "stream_${Port}"
									For example, if a client connets to port 4000, OME creates a "stream_4000" stream
									<Stream>
										<Name>stream_${Port}</Name>
										<Port>4000,4001-4004</Port>
									</Stream>
									<Stream>
										<Name>stream_4005</Name>
										<Port>4005</Port>
									</Stream>
								-->
								<Stream>
									<Name>stream_${Port}</Name>
									<Port>4000</Port>
								</Stream>
							</StreamMap>
						</MPEGTS>
					</Providers>
					<Publishers>
						<AppWorkerCount>1</AppWorkerCount>
						<StreamWorkerCount>8</StreamWorkerCount>
						<OVT />
						<WebRTC>
							<Timeout>30000</Timeout>
							<Rtx>false</Rtx>
							<Ulpfec>false</Ulpfec>
							<JitterBuffer>false</JitterBuffer>
						</WebRTC>
						<LLHLS>
							<ChunkDuration>0.5</ChunkDuration>
							<!-- PartHoldBack SHOULD be at least three times the Part Target Duration -->
							<PartHoldBack>1.5</PartHoldBack>
							<SegmentDuration>6</SegmentDuration>
							<SegmentCount>10</SegmentCount>
							<CrossDomains>
								<Url>*</Url>
							</CrossDomains>
						</LLHLS>
					</Publishers>
				</Application>
			</Applications>
		</VirtualHost>
	</VirtualHosts>
</Server>
```
# Starting it up
Now that everything has been created and configured... it's time to start your instances.

Inside the ~/docker/ovenmediaengine folder do the following command
```
docker compose up -d
```
It should start up! You can view the logs by doing
```
docker compose logs -f
```
and stop viewing the logs with ctrl+C

Now that ovenmediaengine is running... it's time to start radium-next

Inside the ~/docker/radium-next folder do the following command
```
docker compose up -d
```
again to view logs it works the same way as before. If you have any problems try to solve it using the logs.

Now you're ready to stream from OBS!

# OBS Instructions
Under the stream tab of OBS set the following...

```
Server: rtmp://stream.example.com:1935/app
Stream Key: stream

```

Under the output tab of OBS change Output Mode to "Advanced" then select the "Streaming" tab.

Set the following if you have NVIDIA NVENC as an Encoder
```
Encoder: NVDIA NVENC H.264

Rate Control: CBR
Bitrate: Your choice

The only other important encoder settings are as follows
Tuning: Ultra Low Latency
Keyframe Interval: 1
Max B-frames (IMPORTANT): 0

If you don't set Max B-frames to 0 some browsers will have issues playing the stream.
```

Set the following if you don't have NVIDA NVENC
```
Encoder: x265

Rate Control: CBR
Bitrate: Your choice

Keyframe Interval: 1
CPU Usage Preset: ultrafast
Profile: main
Tune: zerolatency

x264 Options (separated by space): bframes=0 threads=8
```

Congrats, now you should be able to stream from OBS to stream.example.com

If you can figure out how to change the stream key let me know I want to know!