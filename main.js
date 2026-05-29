document.addEventListener("DOMContentLoaded", () => {
    const newsGrid = document.getElementById("news-grid");
    const navLinks = document.querySelectorAll(".main-nav a");
    let allPosts = []; // لتخزين كل الأخبار

    // جلب البيانات من ملف JSON
    fetch("posts.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("فشل تحميل البيانات: " + response.status);
            }
            return response.json();
        })
        .then(posts => {
            allPosts = posts;
            renderPosts("الكل"); // عرض كل الأخبار عند فتح الموقع
        })
        .catch(error => {
            console.error("خطأ في جلب البيانات:", error);
            newsGrid.innerHTML = "<p style='text-align: center; color: #666; padding: 40px;'>عذراً، تعذر تحميل الأخبار. تأكد من فتح الموقع عبر خادم محلي وليس من ملف.</p>";
        });

    // دالة عرض الأخبار بناءً على التصنيف
    function renderPosts(category) {
        newsGrid.innerHTML = ""; // تفريغ الشاشة
        
        // تصفية الأخبار حسب التصنيف المختار
        const filteredPosts = category === "الكل" ? allPosts : allPosts.filter(post => post.category === category);

        filteredPosts.forEach(post => {
            const cardHTML = `
                <article class="news-card">
                    <div style="position: relative;">
                        <img src="${post.image}" alt="صورة الخبر" class="news-image" loading="lazy">
                        <span class="category-badge">${post.category}</span>
                    </div>
                    <div class="news-content">
                        <span class="news-date">${post.date}</span>
                        <h3 class="news-title">${post.title}</h3>
                        <a href="${post.url}" class="read-more">قراءة التفاصيل</a>
                    </div>
                </article>
            `;
            newsGrid.innerHTML += cardHTML;
        });
    }

    // تفعيل أزرار القائمة العلوية
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // منع إعادة تحميل الصفحة
            
            // إزالة اللون من كل الأزرار وإضافته للزر المضغوط فقط
            navLinks.forEach(l => l.classList.remove("active"));
            e.target.classList.add("active");
            
            // جلب اسم التصنيف وعرض أخباره
            const selectedCategory = e.target.getAttribute("data-category");
            renderPosts(selectedCategory);
        });
    });
});