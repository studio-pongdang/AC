gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    // 🌟 1. 새로운 커스텀 커서 로직 (다이아몬드 회전 및 트래킹)
    const cursorCore = document.querySelector('.cursor-core');
    const cursorDiamond = document.querySelector('.cursor-diamond');

    // 다이아몬드가 허공에서 천천히 자전하도록 무한 회전 애니메이션 추가
    gsap.to(cursorDiamond, {
        rotation: "+=360", // 현재 각도에서 360도씩 계속 회전
        duration: 12,
        repeat: -1,
        ease: "linear"
    });

    // 마우스 이동 시 커서 위치 업데이트
    window.addEventListener('mousemove', (e) => {
        // 코어는 마우스 위치에 즉시 고정 (CSS transform 중복 방지를 위해 left/top 사용)
        cursorCore.style.left = `${e.clientX - 2}px`; // 중앙 정렬 (width의 절반)
        cursorCore.style.top = `${e.clientY - 2}px`;

        // 다이아몬드는 GSAP를 이용해 부드럽게 따라오게 함
        gsap.to(cursorDiamond, {
            left: e.clientX - (cursorDiamond.offsetWidth / 2),
            top: e.clientY - (cursorDiamond.offsetHeight / 2),
            duration: 0.15,
            ease: "power2.out"
        });
    });

    // 클릭 가능한 요소에 마우스 호버 시 커서 모양 변경
    const interactables = document.querySelectorAll('a, button, input');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hover-active'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hover-active'));
    });

    // 🌟 2. 인트로 및 BGM 제어 로직
    const introScreen = document.getElementById('introScreen');
    const enterBtn = document.getElementById('enterBtn');
    const bgmAudio = document.getElementById('bgmAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const bgmPlayerUI = document.querySelector('.bgm-player');

    // 초기 인트로 텍스트 등장
    gsap.from(".fade-in-intro", {
        y: 20, opacity: 0, duration: 1.5, stagger: 0.4, ease: "power2.out", delay: 0.5
    });

    // 메인 Scene 1 애니메이션 세팅 (일시정지 상태로 둠)
    const introTl = gsap.timeline({ paused: true });
    introTl.from("#scene1 .fade-up", {
        y: 40, opacity: 0, duration: 1.5, stagger: 0.3, ease: "power3.out"
    });

    // 입장하기 버튼 클릭 시 이벤트
    enterBtn.addEventListener('click', () => {
        bgmAudio.volume = volumeSlider.value;
        bgmAudio.play();

        ambientAudio.volume = 0;
        ambientAudio.play();

        // 인트로 화면 암전(Fade-out) 및 메인 씬 시작
        gsap.to(introScreen, {
            opacity: 0,
            duration: 1.5,
            ease: "power2.inOut",
            onComplete: () => {
                introScreen.style.display = 'none';
                introTl.play(); // Scene 1 텍스트 등장

                // BGM 플레이어 UI 등장
                gsap.to(bgmPlayerUI, { opacity: 1, duration: 1, pointerEvents: "auto" });
            }
        });
    });

    // BGM 재생/일시정지 토글
    playPauseBtn.addEventListener('click', () => {
        if (bgmAudio.paused) {
            bgmAudio.play();
            playPauseBtn.innerText = "PAUSE";
        } else {
            bgmAudio.pause();
            playPauseBtn.innerText = "PLAY";
        }
    });

    // BGM 볼륨 조절
    volumeSlider.addEventListener('input', (e) => {
        bgmAudio.volume = e.target.value;
    });


    // 🌟 3. 스크롤 애니메이션 (Scene 2, 3, 4)
    const scenes = ["#scene2", "#scene3", "#scene4"];

    scenes.forEach((scene) => {
        gsap.from(`${scene} .fade-in`, {
            scrollTrigger: { trigger: scene, start: "top 70%" },
            opacity: 0, duration: 1.8, stagger: 0.2, ease: "power2.inOut"
        });

        gsap.from(`${scene} .fade-up`, {
            scrollTrigger: { trigger: scene, start: "top 75%" },
            y: 30, opacity: 0, duration: 1.5, stagger: 0.2, ease: "power3.out"
        });
    });

    // 🌟 1. 앰비언트 사운드 (ASMR) 교차 페이드인
    // Scene 2 (제2미술실 설명) 영역에 진입하면 바람/거친 붓소리가 서서히 들림
    const ambientAudio = document.getElementById('ambientAudio');
    ScrollTrigger.create({
        trigger: "#scene2",
        start: "top 60%",   // 화면 60% 지점 도달 시
        end: "bottom top",
        onEnter: () => gsap.to(ambientAudio, { volume: 0.5, duration: 2 }), // 볼륨 서서히 커짐
        onLeave: () => gsap.to(ambientAudio, { volume: 0, duration: 2 }),   // 벗어나면 줄어듦
        onEnterBack: () => gsap.to(ambientAudio, { volume: 0.5, duration: 2 }),
        onLeaveBack: () => gsap.to(ambientAudio, { volume: 0, duration: 2 }),
    });


    // 🌟 2. 이스터에그: 16:20 마법 (Real-time Sync)
    const timeStampElem = document.querySelector('#scene4 .time-stamp');
    const storyTitleElem = document.querySelector('#scene4 .story-title');

    function checkTimeSync() {
        const now = new Date();
        // 기기 시간이 오후 4시 20분일 때 발동
        if (now.getHours() === 16 && now.getMinutes() === 20) {
            timeStampElem.innerText = "2026. 02. 19 (목) 16:20 - TIME SYNCED";
            timeStampElem.style.color = "#ffffff";
            timeStampElem.style.textShadow = "0 0 10px rgba(255,255,255,0.4)";

            storyTitleElem.innerHTML = "우연이네요.<br>우리, 같은 시간에 문을 열었군요.";
        }
    }
    checkTimeSync(); // 로드 시 체크
    setInterval(checkTimeSync, 30000); // 30초마다 갱신

    // 🌟 3. 이스터에그: 키워드 타이핑 트리거 ('BLUE' or 'SKY')
    let keyBuffer = "";
    const blueFlash = document.getElementById('blueFlashOverlay');

    window.addEventListener('keydown', (e) => {
        // 알파벳만 버퍼에 추가
        if (e.key.length === 1 && e.key.match(/[a-zA-Z]/i)) {
            keyBuffer += e.key.toUpperCase();

            // 버퍼가 길어지면 앞부분 자르기
            if (keyBuffer.length > 10) {
                keyBuffer = keyBuffer.substring(1);
            }

            // BLUE 나 SKY를 연속으로 타이핑했다면
            if (keyBuffer.includes("BLUE") || keyBuffer.includes("SKY")) {
                // 화면 전체에 파란빛이 번짐
                blueFlash.classList.add('active');

                // 0.1초 뒤 클래스를 지우면 CSS transition에 의해 1.5초간 서서히 흑백으로 돌아옴
                setTimeout(() => {
                    blueFlash.classList.remove('active');
                }, 100);

                keyBuffer = ""; // 버퍼 초기화
            }
        }
    });
});

// 🌟 2. 프로필 이미지 3D 틸트 (Parallax Portrait)
const tiltWrapper = document.querySelector('.char-image-wrapper');
const tiltImage = document.querySelector('.char-image');

if (tiltWrapper && tiltImage) {
    tiltWrapper.addEventListener('mousemove', (e) => {
        const rect = tiltWrapper.getBoundingClientRect();
        // 이미지 중심점 기준 마우스 위치 계산 (-1 ~ 1 사이의 값)
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

        // X축, Y축 최대 12도 꺾임
        gsap.to(tiltImage, {
            rotateX: y * -12,
            rotateY: x * 12,
            scale: 1.05, /* 살짝 확대되어 입체감 극대화 */
            duration: 0.4,
            ease: "power2.out"
        });
    });

    // 마우스가 벗어나면 원상복구
    tiltWrapper.addEventListener('mouseleave', () => {
        gsap.to(tiltImage, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out"
        });
    });
}

// 🌟 5. 유리가 깨지는 듯한 'CRACK' 화면 전환 연출
const doorBtn = document.getElementById('doorBtn');
const crackOverlay = document.getElementById('crackOverlay');

if (doorBtn && crackOverlay) {
    doorBtn.addEventListener('click', (e) => {
        e.preventDefault(); // 기본 링크 이동(페이지 바로 넘어가기) 방지
        const targetUrl = doorBtn.getAttribute('href');

        crackOverlay.style.display = 'block'; // 오버레이 등장

        // 1. 화면 전체를 강하게 흔듦 (지진 효과)
        gsap.to(window, { x: 8, y: -8, duration: 0.05, yoyo: true, repeat: 5 });

        // 2. 균열 애니메이션 클래스 추가 (0.1초만에 쩍! 갈라짐)
        crackOverlay.classList.add('crack-active');

        // 3. 아주 짧은 섬광(Flash) 후 화면 전체를 칠흑 같은 어둠으로 덮음
        setTimeout(() => {
            gsap.to(crackOverlay, {
                backgroundColor: '#000000',
                duration: 0.4,
                ease: "power2.inOut",
                onComplete: () => {
                    // 4. 완전한 어둠 속에서 채팅 페이지로 이동
                    window.location.href = targetUrl;
                }
            });
        }, 300); // 균열이 생기고 0.3초 뒤에 암전 시작
    });
}