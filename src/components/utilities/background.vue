<script setup>
import {onBeforeUnmount, onMounted} from "vue";

    const { color } = defineProps({
        color: {
            type: String,
            default: '#9f9f9f'
        }
    });

    const STAR_COLOR = color;
    const STAR_SIZE = 3;
    const STAR_MIN_SCALE = 0.2;
    const OVERFLOW_THRESHOLD = 50;
    const STAR_COUNT = ( window.innerWidth + window.innerHeight ) / 8;

    let canvas;
    let context;

    let scale = 1, // device pixel ratio
        width,
        height;

    let stars = [];

    let pointerX,
        pointerY;

    let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };

    let touchInput = false;

    onMounted(() => {
        canvas = document.querySelector( 'canvas' );
        context = canvas.getContext( '2d' );

        /*          *     .        *  .    *    *   .
         .  *  move your mouse to over the stars   .
         *  .  .   change these values:   .  *
           .      * .        .          * .       */

        generate();
        resize();
        step();

        window.onresize = resize;
        canvas.onmousemove = onMouseMove;
        canvas.ontouchmove = onTouchMove;
        canvas.ontouchend = onMouseLeave;
        document.onmouseleave = onMouseLeave;
    });

    onBeforeUnmount(() => {
        // remove event listeners
        window.removeEventListener('resize', resize);
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('touchmove', onTouchMove);
        canvas.removeEventListener('touchend', onMouseLeave);
        document.removeEventListener('mouseleave', onMouseLeave);

        // reset canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // reset stars
        stars = [];

        // reset canvas
        canvas = null;
        context = null;
    });

    const generate = () => {

        for( let i = 0; i < STAR_COUNT; i++ ) {
            stars.push({
                x: 0,
                y: 0,
                z: STAR_MIN_SCALE + Math.random() * ( 1 - STAR_MIN_SCALE )
            });
        }
    }
    const placeStar = (star) => {

        star.x = Math.random() * width;
        star.y = Math.random() * height;

    }
    const recycleStar = (star) => {

        let direction = 'z';

        let vx = Math.abs( velocity.x ),
            vy = Math.abs( velocity.y );

        if( vx > 1 || vy > 1 ) {
            let axis;

            if( vx > vy ) {
                axis = Math.random() < vx / ( vx + vy ) ? 'h' : 'v';
            }
            else {
                axis = Math.random() < vy / ( vx + vy ) ? 'v' : 'h';
            }

            if( axis === 'h' ) {
                direction = velocity.x > 0 ? 'l' : 'r';
            }
            else {
                direction = velocity.y > 0 ? 't' : 'b';
            }
        }

        star.z = STAR_MIN_SCALE + Math.random() * ( 1 - STAR_MIN_SCALE );

        if( direction === 'z' ) {
            star.z = 0.1;
            star.x = Math.random() * width;
            star.y = Math.random() * height;
        }
        else if( direction === 'l' ) {
            star.x = -OVERFLOW_THRESHOLD;
            star.y = height * Math.random();
        }
        else if( direction === 'r' ) {
            star.x = width + OVERFLOW_THRESHOLD;
            star.y = height * Math.random();
        }
        else if( direction === 't' ) {
            star.x = width * Math.random();
            star.y = -OVERFLOW_THRESHOLD;
        }
        else if( direction === 'b' ) {
            star.x = width * Math.random();
            star.y = height + OVERFLOW_THRESHOLD;
        }

    }
    const resize = () => {
        scale = window.devicePixelRatio || 1;

        width = window.innerWidth * scale;
        height = window.innerHeight * scale;

        canvas.width = width;
        canvas.height = height;

        stars.forEach( placeStar );
    }
    const step = () => {
        if (context === null) return;
        context.clearRect( 0, 0, width, height );
        update();
        render();
        requestAnimationFrame( step );
    }

    const update = () => {

        velocity.tx *= 0.96;
        velocity.ty *= 0.96;

        velocity.x += ( velocity.tx - velocity.x ) * 0.8;
        velocity.y += ( velocity.ty - velocity.y ) * 0.8;

        stars.forEach( ( star ) => {

            star.x += velocity.x * star.z;
            star.y += velocity.y * star.z;

            star.x += ( star.x - width/2 ) * velocity.z * star.z;
            star.y += ( star.y - height/2 ) * velocity.z * star.z;
            star.z += velocity.z;

            // recycle when out of bounds
            if( star.x < -OVERFLOW_THRESHOLD || star.x > width + OVERFLOW_THRESHOLD || star.y < -OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD ) {
                recycleStar( star );
            }

        } );

    }

    const render = () => {

        stars.forEach( ( star ) => {

            context.beginPath();
            context.lineCap = 'round';
            context.lineWidth = STAR_SIZE * star.z * scale;
            context.globalAlpha = 0.5 + 0.5*Math.random();
            context.strokeStyle = STAR_COLOR;

            context.beginPath();
            context.moveTo( star.x, star.y );

            let tailX = velocity.x * 2,
                tailY = velocity.y * 2;

            // stroke() wont work on an invisible line
            if( Math.abs( tailX ) < 0.1 ) tailX = 0.5;
            if( Math.abs( tailY ) < 0.1 ) tailY = 0.5;

            context.lineTo( star.x + tailX, star.y + tailY );

            context.stroke();

        } );

    }

    const movePointer = ( x, y ) => {

        if( typeof pointerX === 'number' && typeof pointerY === 'number' ) {

            let ox = x - pointerX,
                oy = y - pointerY;

            velocity.tx = velocity.tx + ( ox / 8*scale ) * ( touchInput ? 1 : -1 );
            velocity.ty = velocity.ty + ( oy / 8*scale ) * ( touchInput ? 1 : -1 );

        }

        pointerX = x;
        pointerY = y;

    }

    const onMouseMove = ( event ) => {

        touchInput = false;

        movePointer( event.clientX, event.clientY );

    }

    const onTouchMove = ( event ) => {

        touchInput = true;

        movePointer( event.touches[0].clientX, event.touches[0].clientY, true );


    }

    const onMouseLeave = () => {

        pointerX = null;
        pointerY = null;

    }
</script>

<template>
    <canvas></canvas>
</template>

<style scoped>
body {
    width: 100%;
    height: 100vh;
    background-color: var(--color-background);
    background-image: radial-gradient(circle at top right, rgba(209, 199, 215, 0.86),       transparent),
    radial-gradient(circle at 20% 80%, rgba(245, 248, 250, 0.68), transparent)
}
canvas {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
}

a {
    position: absolute;
    bottom: 2vmin;
    right: 2vmin;
    color: rgba(255, 255, 255, 0.78);
    text-decoration: none;
}

a:hover {
    color: #f8f6f6;
}
</style>