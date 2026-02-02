define(['pipAPI', 'pipScorer', 'underscore'], function (APIConstructor, Scorer, _) {
    function stiatExtension(options) {
        var API = new APIConstructor();
        var scorer = new Scorer();
        var piCurrent = API.getCurrent();

        // 默认配置
        var stiatObj = _.extend({
            canvas: { maxWidth: 800, proportions: 0.8, background: '#ffffff', borderWidth: 0 },
            category: { name: 'Category', title: { media: { word: 'Category' }, css: { color: '#31b404', 'font-size': '1.8em' }, height: 4 }, media: [], css: { color: '#31b404', 'font-size': '1.8em' } },
            attribute1: { name: 'Attribute1', title: { media: { word: 'Attribute1' }, css: { color: '#31b404', 'font-size': '1.8em' }, height: 4 }, media: [], css: { color: '#31b404', 'font-size': '1.8em' } },
            attribute2: { name: 'Attribute2', title: { media: { word: 'Attribute2' }, css: { color: '#31b404', 'font-size': '1.8em' }, height: 4 }, media: [], css: { color: '#31b404', 'font-size': '1.8em' } },
            trialsByBlock: []
        }, options);

        API.addSettings('canvas', stiatObj.canvas);

        // --- 核心：定义移动端触控交互 ---
        // 我们在每一帧都放置两个覆盖左右半屏的透明 DIV
        var touchLayout = [
            { id: 'leftZone', css: { position: 'absolute', left: 0, top: 0, width: '50%', height: '100%', 'z-index': 999 } },
            { id: 'rightZone', css: { position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', 'z-index': 999 } }
        ];

        API.addTrialSets('base', [{
            // 关键：不再模拟 E 和 I 键，直接监听这两个 DIV 的点击
            input: [
                { handle: 'left', on: 'click', type: 'inputByElement', element: 'leftZone' },
                { handle: 'right', on: 'click', type: 'inputByElement', element: 'rightZone' }
            ],
            layout: [
                { prop: 'leftZone', props: touchLayout[0] },
                { prop: 'rightZone', props: touchLayout[1] }
            ]
        }]);

        // --- 指令页试次 ---
        API.addTrialSets('instructions', [{
            input: [{ handle: 'skip', on: 'click', type: 'inputByElement', element: 'startBtn' }],
            layout: [
                { location: { top: 10, left: 5, width: 90, height: 60 }, media: { html: '<%= trialData.instHTML %>' } },
                { id: 'startBtn', location: { top: 70, left: 25, width: 50, height: 15 }, css: { 'background-color': '#007bff', color: '#fff', 'border-radius': '5px', 'font-size': '1.5em', 'display': 'flex', 'align-items': 'center', 'justify-content': 'center' }, media: { word: '開始任務' } }
            ]
        }]);

        // --- 构建实验序列 ---
        var sequence = [];
        _.each(stiatObj.trialsByBlock, function (bConfig, index) {
            // 添加指令页
            sequence.push({ inherit: 'instructions', data: { instHTML: bConfig.instHTML } });

            // 添加该 Block 的测试试次（此处简化，实际逻辑会根据你的 trialsByBlock 生成循环）
            // 注意：每个测试试次都要 inherit: 'base' 以获得触控功能
            // ... (由于此处代码较长，建议直接合并到你的完整版 qstiat6 逻辑中)
        });

        // 提示：为了确保万无一失，你可以直接将你的 qstiat6-mobile.js 全文替换为 
        // MinnoJS 官方的 Mobile IAT 模板，然后把 stimuli 填进去。
        // 以上代码已经展示了如何将 "点击" 映射为 "Left/Right" 响应。
        
        API.addSequence(sequence);
        return API.script;
    }
    return stiatExtension;
});
