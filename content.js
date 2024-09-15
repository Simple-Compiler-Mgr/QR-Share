console.log('content.js 已加载');

function createQRCode() {
  console.log('createQRCode 函数已调用');

  try {
    // 获取主题色
    const themeColor = getThemeColor();

    // 创建按钮
    const button = document.createElement('div');
    button.id = 'qr-code-button';
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z"/></svg>';
    button.style.backgroundColor = themeColor;

    // 创建容器
    const container = document.createElement('div');
    container.id = 'qr-code-container';
    
    // 创建二维码元素
    const qrCode = document.createElement('div');
    qrCode.id = 'qr-code';
    
    // 创建网站图标元素
    const favicon = document.createElement('img');
    favicon.id = 'favicon';
    favicon.src = getFaviconUrl();
    
    // 创建网站名称元素
    const siteName = document.createElement('div');
    siteName.id = 'site-name';
    siteName.textContent = document.title;
    
    // 将元素添加到容器中
    qrCode.appendChild(favicon);
    container.appendChild(qrCode);
    container.appendChild(siteName);
    
    // 将按钮和容器添加到页面
    document.body.appendChild(button);
    document.body.appendChild(container);
    
    console.log('QR码容器已添加到页面');
    
    // 使用qrcode.js库生成二维码
    if (typeof QRCode === 'undefined') {
      throw new Error('QRCode 未定义');
    }
    new QRCode(qrCode, {
      text: window.location.href,
      width: 128,
      height: 128
    });
    console.log('QR码已生成');

    let timeoutId;

    // 添加鼠标事件
    button.addEventListener('mouseenter', () => {
      clearTimeout(timeoutId);
      container.style.display = 'block';
    });

    function hideContainer() {
      timeoutId = setTimeout(() => {
        container.style.display = 'none';
      }, 300); // 300毫秒的延迟
    }

    button.addEventListener('mouseleave', hideContainer);

    container.addEventListener('mouseenter', () => {
      clearTimeout(timeoutId);
    });

    container.addEventListener('mouseleave', hideContainer);

    // 添加点击事件监听器
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // 阻止事件冒泡
      copyCurrentURL();
    });

  } catch (error) {
    console.error('QR码生成失败:', error);
    const container = document.createElement('div');
    container.id = 'qr-code-container';
    container.textContent = '二维码生成失败';
    document.body.appendChild(container);
  }
}

function getFaviconUrl() {
  // 尝试获取高质量的favicon
  const links = document.getElementsByTagName('link');
  for (let i = 0; i < links.length; i++) {
    if (links[i].rel.indexOf('icon') > -1 && links[i].href) {
      return links[i].href;
    }
  }
  // 如果没有找到，返回默认的favicon路径
  return '/favicon.ico';
}

function getThemeColor() {
  // 尝试从meta标签获取主题色
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    return metaThemeColor.getAttribute('content');
  }

  // 如果没有meta标签，尝试从主要元素获取颜色
  const elements = [
    document.body,
    document.querySelector('header'),
    document.querySelector('nav'),
    document.querySelector('#header'),
    document.querySelector('.header')
  ];

  for (const element of elements) {
    if (element) {
      const color = window.getComputedStyle(element).backgroundColor;
      if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
        return color;
      }
    }
  }

  // 如果都没有找到，返回默认颜色
  return '#007bff';
}

// 添加复制URL的函数
function copyCurrentURL() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    // 复制成功后的视觉反馈
    const feedback = document.createElement('div');
    feedback.textContent = 'URL已复制！';
    feedback.style.cssText = `
      position: fixed;
      bottom: 70px;
      right: 20px;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-size: 14px;
      z-index: 10001;
    `;
    document.body.appendChild(feedback);
    setTimeout(() => {
      document.body.removeChild(feedback);
    }, 2000);
  }).catch(err => {
    console.error('无法复制URL: ', err);
  });
}

// 页面加载完成后执行
window.addEventListener('load', function() {
  console.log('页面加载完成，准备创建QR码');
  if (typeof QRCode === 'undefined') {
    console.error('QRCode库未正确加载');
  } else {
    createQRCode();
  }
});