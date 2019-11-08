/* TOOL */
let chon_anh = document.getElementById("chon_anh");
let img_input = document.getElementById("anh_goc");
let anh_ket_qua = document.getElementById("anh_ket_qua");

/* BUTTON */ 
let anh_xam = document.getElementById("anh_xam");
let anh_nhi_phan = document.getElementById("anh_nhi_phan");
let histogram = document.getElementById("histogram");

/* KÍCH THƯỚC ẢNH */
function KichThuocAnh(){
    document.getElementById("chieu_rong").innerHTML =  anh_ket_qua.width + " px";
    document.getElementById("chieu_cao").innerHTML = anh_ket_qua.height + " px";
}

/* HIỆN ẢNH */
chon_anh.addEventListener('change', (e) =>{
    img_input.src = URL.createObjectURL(e.target.files[0]); 
});

/* ẢNH XÁM */
anh_xam.addEventListener('click', () =>{
    // cv.imread (imageSource):  dùng để đọc hình ảnh từ canvas html
    let src = cv.imread(img_input);

    /*
        cv.cvtColor (src, dst, code, dstCn = 0)
        src: ảnh đầu vào
        dst: hình ảnh đầu ra có cùng kích thước và chiều sâu như src
        code: mã chuyển đổi không gian màu
        dstCn: số kênh trong hình ảnh điểm đến; nếu tham số là 0, số lượng các kênh có nguồn gốc tự động từ src 

    */
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY);
    /* 
        cv.imshow (canvasSource, mat): show ảnh
        canvasSource: phần tử canvas hoặc id của nó
        mat: đường dẫn ảnh đã được xử lí
    */
    cv.imshow('anh_ket_qua',src);

    KichThuocAnh();   
})

/* ẢNH NHỊ PHÂN */
anh_nhi_phan.addEventListener('click', () =>{
    // cv.imread (imageSource):  dùng để đọc hình ảnh từ canvas html
    let src = cv.imread(img_input);
    let dst = new cv.Mat();
    cv.cvtColor(src, src, cv.COLOR_RGB2GRAY);
    
    /*
        cv.threshold(src, dst, min, max, code);
        src: ngồn ảnh
        dst: hình ảnh điểm đến có cùng kích thước và kiểu giống như src.
        min, max: ngưỡng ảnh
        code: mã chuyển đổi không gian màu
    */
    
    cv.threshold(src, dst, 120, 255, cv.THRESH_BINARY);
    cv.imshow('anh_ket_qua', dst);

    KichThuocAnh();   
})

histogram.addEventListener('click', ()=>{
    let src = cv.imread(img_input);

    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);

    let srcVec = new cv.MatVector();
    srcVec.push_back(src);
    let accumulate = false;
    let channels = [0];
    let histSize = [256];
    let ranges = [0, 255];
    let hist = new cv.Mat();
    let mask = new cv.Mat();
    let color = new cv.Scalar(255, 255, 255);
    let scale = 2;
   
    /*
        cv.calcHist (image, channels, mask, hist, histSize, ranges, accumulate = false)

        image: mảng nguồn. 
        chanels: danh sách các kênh lam mo sử dụng để tính toán các biểu đồ.
        mask: mặt nạ tùy chọn.
        hist: histogram đầu ra (cv.CV_32F loại)
        histSize: mảng của biểu đồ kích thước trong mỗi chiều
        rangese: mảng của dims mảng của ranh giới histogram bin trong mỗi chiều.
        accumulate: tinnh năng này cho phép bạn tính toán một biểu đồ duy nhất từ ​​nhiều bộ mảng, hoặc để cập nhật các biểu đồ theo thời gian.
    */
    cv.calcHist(srcVec, channels, mask, hist, histSize, ranges, accumulate);
    
    let result = cv.minMaxLoc(hist, mask);
    let max = result.maxVal;
    let dst = new cv.Mat.zeros(src.rows, histSize[0] * scale,cv.CV_8UC3);
    // draw histogram
    for (let i = 0; i < histSize[0]; i++) {
        let binVal = hist.data32F[i] * src.rows / max;
        let point1 = new cv.Point(i * scale, src.rows - 1);
        let point2 = new cv.Point((i + 1) * scale - 1, src.rows - binVal);
        cv.rectangle(dst, point1, point2, color, cv.FILLED);
    }
    cv.imshow('anh_ket_qua', dst);

})



/*
    Xoay anh: https://docs.opencv.org/3.4/dd/d52/tutorial_js_geometric_transformations.html
    Blur anh: https://docs.opencv.org/3.4/dd/d6a/tutorial_js_filtering.html
    Bien doi hinh thai anh: https://docs.opencv.org/3.4/d4/d76/tutorial_js_morphological_ops.html
    Image Gradients: https://docs.opencv.org/3.4/da/d85/tutorial_js_gradients.html
    Nhan dang khuon mat: https://docs.opencv.org/3.4/d2/d99/tutorial_js_face_detection.html
    Border anh: https://docs.opencv.org/3.4/de/d06/tutorial_js_basic_ops.html
*/
