"use client";

import { useState } from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";
import { motion } from "framer-motion";

const videos = [
    {
        src: "https://github.com/user-attachments/assets/e86beced-45a4-43e1-8639-7491c36aaf3e",
        caption:
            "Для создания альбома нужно заполнить обязательные поля формы, выбрать стриминговый сервис и добавить ссылку на альбом. После этого карточка альбома появится на главной странице",
    },
    {
        src: "https://github.com/user-attachments/assets/ec991222-a189-4c1f-b0b9-98df67f0ce51",
        caption:
            "Чтобы создать папку, нужно указать название. Затем новая папка появится в списке папок. В карточке альбома также отображается список папок. Там можно выбрать в какую папку добавить альбом. После добавления альбом исчезнет с главной страницы и появится в вашей новой папке",
    },
    {
        src: "https://github.com/user-attachments/assets/a9ba4bdf-6b43-499d-9d1e-00f557c43092",
        caption:
            "В приложении реализован поиск по названию альбома или исполнителю. На главной странице осуществляется поиск по всем вашим добавленным альбомам. Поиск в папке ограничен только альбомами, которые туда добавлены.",
    },
    {
        src: "https://github.com/user-attachments/assets/7c393591-747c-4176-b2ae-93a1ce4b97e0",
        caption:
            "Сортировка папок реализована через drag-n-drop. А при удалении папки, все альбомы в ней перемещаются на главную страницу.",
    },
    {
        src: "https://github.com/user-attachments/assets/97cf44ba-ae28-4d31-ba1e-a42aa0a2e2eb",
        caption:
            "На главной странице или в папке можно прослушивать выбранный альбом. Также в карточке альбома можно выбрать стриминговый плеер, назначить плеер по умолчанию для данного альбома или удалить, если это не плеер по умолчанию.",
    },

    {
        src: "https://github.com/user-attachments/assets/6d162819-25e9-4dd5-b1b7-0f2a42a1b876",
        caption:
            "Через меню альбома можно перейти на его страницу (или по клику на обложку), удалить и поделиться ссылкой на альбом. По ссылке открывается страница альбома. Другой авторизованный пользователь сможет скопировать альбом в свою библиотеку. Для неавторизованного пользователя доступно прослушивание альбома.",
    },
];

export default function VideoCarousel() {
    const [current, setCurrent] = useState(0);

    return (
        <section className="relative max-w-7xl px-4 mx-auto h-screen flex flex-col bg-background overflow-hidden py-12">
            <div className="w-full max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden shadow-xl">
                <Plyr
                    source={{
                        type: "video",
                        sources: [
                            {
                                src: videos[current].src,
                                type: "video/mp4",
                            },
                        ],
                    }}
                    options={{
                        controls: ["play-large", "fullscreen"],
                        autoplay: false,
                        muted: true,
                        loop: { active: true },
                        ratio: "16:9",
                    }}
                />
            </div>

            <div className="flex-1 flex items-center justify-center p-4 md:p-0">
                <motion.p
                    key={current}
                    initial={{ opacity: 0, filter: "blur(8px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(8px)" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-md md:text-xl text-muted-foreground font-extralight text-center"
                >
                    {videos[current].caption}
                </motion.p>
            </div>

            <div className="flex justify-center gap-8 pb-4 md:pb-8">
                {videos.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-4 h-4 rounded-full transition ${
                            idx === current ? "bg-foreground" : "bg-muted"
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}
