<template>
       <h1
      class="text-4xl bg-white m-4 p-2 text-transparent text-center align-middle justify-center bg-clip-text backdrop-blur-lg shadow-lg shadown-gray-200 border border-white rounded-3xl flex flex-col"
    >
      顯示資料
    </h1>
    <a href="http://${ipport}"
      ><button
        class="bg-blue-200/70 p-2 rounded-xl hover:bg-blue-300/40 transition-all duration-300"
      >
        即使影像
      </button></a
    >
    <section
      class="bg-gray-200/70 p-4 m-4 min-w-1/3 md:w-fit w-full mx-auto rounded-lg shadow-lg backdrop-blur-sm gap-2 m-3"
    >
      <h3 class="text-3xl text-bold">氣象局</h3>
      <hr />
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        測站:
        <span class="text-yellow-800" id="test_station">N/A</span>
      </p>
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        天氣狀態:
        <span class="text-yellow-800" id="type"></span>
      </p>
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        氣溫:
        <span class="text-yellow-800" id="temp">N/A°C</span>
      </p>
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        濕度:
        <span class="text-yellow-800" id="hum">N/A%</span>
      </p>
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        最高氣溫
        <span class="text-yellow-800" id="daily_high">N/A°C</span>
      </p>
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        最低氣溫
        <span class="text-yellow-800" id="daily_low">N/A°C</span>
      </p>
    </section>
    <section
      class="bg-gray-200/70 p-4 m-4 min-w-1/3 md:w-fit w-full mx-auto rounded-lg shadow-lg backdrop-blur-sm gap-2 m-3"
    >
      <h3 class="text-3xl text-bold">本地</h3>
      <hr />
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        氣溫:
        <span class="text-yellow-800" id="local_temp">N/A°C</span>
      </p>
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        濕度:
        <span class="text-yellow-800" id="local_hum">N/A%</span>
      </p>
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        蠕動馬達
        <button
          onclick="fetchRemote()"
          class="p-2 bg-lime-400 hover:bg-lime-600 rounded-xl m-1 transition-all duration-100"
          id="jistatus2"
        >
          ${data?.local_jistatus ? "關" : "開"}
        </button>
      </p>
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        紅外線
        <button
          onclick="fetchGFA()"
          class="p-2 bg-lime-400 hover:bg-lime-600 rounded-xl m-1 transition-all duration-100"
          id="light2"
        >
          ${gfa() ? "關" : "開"}
        </button>
      </p>
    </section>
    <section
      class="bg-gray-200/70 p-4 m-4 min-w-1/3 md:w-fit w-full mx-auto rounded-lg shadow-lg backdrop-blur-sm gap-2 m-3"
    >
      <h3 class="text-3xl text-bold">GPS 定位</h3>
      <hr />
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        經度:
        <span class="text-yellow-800" id="gps_lat">N/A</span>
      </p>
      <p class="p-2 bg-white/60 rounded-2xl m-3 backdrop-blur-sm">
        緯度:
        <span class="text-yellow-800" id="gps_long">N/A</span>
      </p>
    </section>
    <section
      class="bg-gray-200/70 p-4 m-4 min-w-1/3 md:w-fit w-full mx-auto rounded-lg shadow-lg backdrop-blur-sm gap-2 m-3"
    >
      <ul id="detected_list">
        <!--${getList}-->
        ${ fcja().length > 0 ? fcja() .map( (item) => `
        <li>
          <a href="${item.imageURL}"
            ><div>
              <span>${item.item}</span>
              <br />
              偵測時間: ${formatTime(String(item?.time))}
              <br />
              <!--${item}-->
            </div></a
          >
        </li>
        `, ) .join("") : `
        <li>尚未偵測到物種</li>
        ` }
      </ul>
    </section>
    <div
      class="fixed bottom-0 p-1 px-2 m-2 right-0 bg-white rounded-xl flex items-center gap-2"
    >
      <i id="connectstatus" class="bi bi-dot text-red-500 text-4xl"></i>
      <span id="connectstatusText" class="text-center">沒有連線</span>
    </div>
</template>