// Bat su kien POST
function Translate() {
    // phuong thuc bat su kien
    function bindEvent() {
        // bat su kien click vao nut edit
        $('#btn-dich').click(function (e) {
            var params = {
                content: $('#txtNoiDung').val()
            }

            // Lay ra url hien tai
            var base_url = 'localhost:3000';
            

            // goi ajax de gui du lieu len server theo phuong thuc POST
            $.ajax({
                url: 'http://localhost:3000/translate',
                type: "POST",
                data: params,
                dataType: "json",
                success: function (res) {
                    if (res && res.status_code == 200) {
                       
                    }
                }
            })
        });
    }

    bindEvent();

}

$(document).ready(function () {
    new Translate();
})