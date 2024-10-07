self.onmessage = async function (e) {
	const { url } = e.data;
  
	try {
	  const response = await fetch(url);
	  const data = await response.json();
	  postMessage({ result: data });
	} catch (error) {
	  postMessage({ error: error.message });
	}
  };
  