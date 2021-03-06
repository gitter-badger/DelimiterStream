//todo: utilize nodeunit groups
var events = require('events'),
    net = require('net'),
    FakeReader = require('./lib/FakeReader.js'),
    FakeOldReader = require('./lib/FakeOldReader.js'),
    DelimiterStream = require("../DelimiterStream.js"),
    f, s;

//polyfill for 0.8.x node
if (events.EventEmitter.listenerCount === undefined) {
    events.EventEmitter.listenerCount = function(emitter, type) {
        var ret;
        if (!emitter._events || !emitter._events[type])
            ret = 0;
        else if (typeof emitter._events[type] === 'function')
            ret = 1;
        else
            ret = emitter._events[type].length;
        return ret;
    };
}

exports.noMatches = function(test) {
    //test without any matches
    var oldStream = !!test.__oldStyle;
    if (oldStream) {
        f = new FakeOldReader();
    } else {
        f = new FakeReader();
    }
    var gotData = false;
    f.on('done', function(isOld) {
        test.equal(isOld, oldStream); //sanity check
        test.ok(!gotData);
        test.done();
    });
    s = new DelimiterStream(f, "\n", "binary", oldStream);
    s.on('data', function() {
        gotData = true;
    });
    s.resume();
    f.begin();
};
exports.noMatchesOld = function(test) {
    test.__oldStyle = true;
    exports.noMatches(test);
};

exports.binaryOneMatch = function(test) {
    var oldStream = !!test.__oldStyle;
    if (oldStream) {
        f = new FakeOldReader();
    } else {
        f = new FakeReader();
    }
    f.write(10, 275); //"\n"
    var gotData = false;
    f.on('done', function(isOld) {
        test.equal(isOld, oldStream); //sanity check
        test.ok(gotData);
        test.done();
    });

    s = new DelimiterStream(f, 10, "binary", oldStream);
    s.on('data', function(data) {
        test.equal(data.length, 275);
        gotData = true;
    });
    s.resume();
    f.begin();
};
exports.binaryOneMatchOld = function(test) {
    test.__oldStyle = true;
    exports.binaryOneMatch(test);
};

exports.stringOneMatch = function(test) {
    var oldStream = !!test.__oldStyle;
    if (oldStream) {
        f = new FakeOldReader('utf8');
    } else {
        f = new FakeReader('utf8');
    }
    f.write("\n", 275); //"\n"
    var gotData = false;
    f.on('done', function(isOld) {
        test.equal(isOld, oldStream); //sanity check
        test.ok(gotData);
        test.done();
    });

    s = new DelimiterStream(f, "\n", "utf8", oldStream);
    s.on('data', function(data) {
        test.equal(data.length, 275);
        gotData = true;
    });
    s.resume();
    f.begin();
};
exports.stringOneMatchOld = function(test) {
    test.__oldStyle = true;
    exports.stringOneMatch(test);
};

exports.binaryMatchFirst = function(test) {
    var oldStream = !!test.__oldStyle;
    if (oldStream) {
        f = new FakeOldReader();
    } else {
        f = new FakeReader();
    }
    f.write(10, 0); //"\n"
    var gotData = false;
    f.on('done', function(isOld) {
        test.equal(isOld, oldStream); //sanity check
        test.ok(gotData);
        test.done();
    });

    s = new DelimiterStream(f, 10, "binary", oldStream);
    s.on('data', function(data) {
        test.equal(data.length, 0);
        gotData = true;
    });
    s.resume();
    f.begin();
};
exports.binaryMatchFirstOld = function(test) {
    test.__oldStyle = true;
    exports.binaryMatchFirst(test);
};

exports.stringMatchFirst = function(test) {
    var oldStream = !!test.__oldStyle;
    if (oldStream) {
        f = new FakeOldReader('utf8');
    } else {
        f = new FakeReader('utf8');
    }
    f.write("\n", 0);
    var gotData = false;
    f.on('done', function(isOld) {
        test.equal(isOld, oldStream); //sanity check
        test.ok(gotData);
        test.done();
    });

    s = new DelimiterStream(f, "\n", "utf8", oldStream);
    s.on('data', function(data) {
        test.equal(data.length, 0);
        gotData = true;
    });
    s.resume();
    f.begin();
};
exports.stringMatchFirstOld = function(test) {
    test.__oldStyle = true;
    exports.stringMatchFirst(test);
};

exports.binaryMatchLast = function(test) {
    var oldStream = !!test.__oldStyle;
    if (oldStream) {
        f = new FakeOldReader();
    } else {
        f = new FakeReader();
    }
    f.write(10, 999); //"\n"
    var gotData = false;
    f.on('done', function(isOld) {
        test.equal(isOld, oldStream); //sanity check
        test.ok(gotData);
        test.done();
    });

    s = new DelimiterStream(f, 10, "binary", oldStream);
    s.on('data', function(data) {
        test.equal(data.length, 999);
        gotData = true;
    });
    s.resume();
    f.begin();
};
exports.binaryMatchLastOld = function(test) {
    test.__oldStyle = true;
    exports.binaryMatchLast(test);
};

exports.stringMatchLast = function(test) {
    var oldStream = !!test.__oldStyle;
    if (oldStream) {
        f = new FakeOldReader('utf8');
    } else {
        f = new FakeReader('utf8');
    }
    f.write("\n", 999);
    var gotData = false;
    f.on('done', function(isOld) {
        test.equal(isOld, oldStream); //sanity check
        test.ok(gotData);
        test.done();
    });

    s = new DelimiterStream(f, "\n", "utf8", oldStream);
    s.on('data', function(data) {
        test.equal(data.length, 999);
        gotData = true;
    });
    s.resume();
    f.begin();
};
exports.stringMatchLastOld = function(test) {
    test.__oldStyle = true;
    exports.stringMatchLast(test);
};

exports.binaryTenMatches = function(test) {
    var matchIndexes = [1,50,250,600,602,605,609,800,900,1000];

    var oldStream = !!test.__oldStyle;
    if (oldStream) {
        f = new FakeOldReader();
    } else {
        f = new FakeReader();
    }
    matchIndexes.forEach(function(m) {
        f.write(10, m); //"\n"
    });

    var dataCount = matchIndexes.length - 1;
    f.on('done', function(isOld) {
        test.equal(isOld, oldStream); //sanity check
        test.equal(dataCount, 0);
        test.done();
    });

    s = new DelimiterStream(f, 10, "binary", oldStream);
    var lastMatch = 0,
        currentMatch;
    s.on('data', function(data) {
        currentMatch = matchIndexes[matchIndexes.length - (dataCount + 1)];
        test.equal(data.length, currentMatch - lastMatch);
        lastMatch = currentMatch + 1;
        dataCount--;
    });
    s.resume();
    f.begin();
};
exports.binaryTenMatchesOld = function(test) {
    test.__oldStyle = true;
    exports.binaryTenMatches(test);
};

exports.stringTenMatches = function(test) {
    var matchIndexes = [1,50,250,600,602,605,609,800,900,1000];

    var oldStream = !!test.__oldStyle;
    if (oldStream) {
        f = new FakeOldReader('utf8');
    } else {
        f = new FakeReader('utf8');
    }
    matchIndexes.forEach(function(m) {
        f.write("\n", m);
    });

    var dataCount = matchIndexes.length - 1;
    f.on('done', function(isOld) {
        test.equal(isOld, oldStream); //sanity check
        test.equal(dataCount, 0);
        test.done();
    });

    s = new DelimiterStream(f, "\n", "utf8", oldStream);
    var lastMatch = 0,
        currentMatch;
    s.on('data', function(data) {
        currentMatch = matchIndexes[matchIndexes.length - (dataCount + 1)];
        test.equal(data.length, currentMatch - lastMatch);
        lastMatch = currentMatch + 1;
        dataCount--;
    });
    s.resume();
    f.begin();
};
exports.stringTenMatchesOld = function(test) {
    test.__oldStyle = true;
    exports.stringTenMatches(test);
};

exports.removedListeners = function(test) {
    f = new FakeOldReader();
    s = new DelimiterStream(f, "\n", "utf8");
    s.on('data', function(data) {});
    s.resume();

    test.equal(events.EventEmitter.listenerCount(f, 'readable'), 1);
    test.equal(events.EventEmitter.listenerCount(f, 'data'), 0);
    test.equal(events.EventEmitter.listenerCount(f, 'close'), 1);

    s.destroy();

    test.equal(events.EventEmitter.listenerCount(f, 'readable'), 0);
    test.equal(events.EventEmitter.listenerCount(f, 'data'), 0);
    test.equal(events.EventEmitter.listenerCount(f, 'close'), 0);
    test.done();
};
exports.removedListenersOld = function(test) {
    f = new FakeOldReader();
    s = new DelimiterStream(f, "\n", "utf8", true);
    s.on('data', function(data) {});
    s.resume();

    test.equal(events.EventEmitter.listenerCount(f, 'data'), 1);
    test.equal(events.EventEmitter.listenerCount(f, 'readable'), 0);
    test.equal(events.EventEmitter.listenerCount(f, 'close'), 1);

    s.destroy();

    test.equal(events.EventEmitter.listenerCount(f, 'data'), 0);
    test.equal(events.EventEmitter.listenerCount(f, 'readable'), 0);
    test.equal(events.EventEmitter.listenerCount(f, 'close'), 0);
    test.done();
};

exports.oneMatchThenClose = function(test) {
    f = new FakeReader('utf8');
    f.write("\n", 275); //"\n"
    var gotData = false,
        gotClose = false;
    f.on('done', function(isOld) {
        test.equal(isOld, false); //sanity check
        test.ok(gotData);

        //"close" the reader on nextTick
        f.close();
        process.nextTick(function() {
            test.ok(gotClose);
            test.equal(events.EventEmitter.listenerCount(f, 'readable'), 0);
            test.equal(events.EventEmitter.listenerCount(f, 'data'), 0);
            test.equal(events.EventEmitter.listenerCount(f, 'close'), 0);
            test.done();
        });
    });

    s = new DelimiterStream(f, "\n", "utf8");
    s.on('data', function(data) {
        test.equal(data.length, 275);
        gotData = true;
    });
    s.on('close', function (data) {
        gotClose = true;
    });
    s.resume();

    test.equal(events.EventEmitter.listenerCount(f, 'readable'), 1);
    test.equal(events.EventEmitter.listenerCount(f, 'data'), 0);
    test.equal(events.EventEmitter.listenerCount(f, 'close'), 1);

    f.begin();
};
exports.oneMatchThenCloseOld = function(test) {
    f = new FakeOldReader('utf8');
    f.write("\n", 275); //"\n"
    var gotData = false,
        gotClose = false;
    f.on('done', function(isOld) {
        test.equal(isOld, true); //sanity check
        test.ok(gotData);

        //"close" the reader on nextTick
        f.close();
        process.nextTick(function() {
            test.ok(gotClose);
            test.equal(events.EventEmitter.listenerCount(f, 'data'), 0);
            test.equal(events.EventEmitter.listenerCount(f, 'readable'), 0);
            test.equal(events.EventEmitter.listenerCount(f, 'close'), 0);
            test.done();
        });
    });

    s = new DelimiterStream(f, "\n", "utf8", true);
    s.on('data', function (data) {
        test.equal(data.length, 275);
        gotData = true;
    });
    s.on('close', function (data) {
        gotClose = true;
    });
    s.resume();

    test.equal(events.EventEmitter.listenerCount(f, 'data'), 1);
    test.equal(events.EventEmitter.listenerCount(f, 'readable'), 0);
    test.equal(events.EventEmitter.listenerCount(f, 'close'), 1);

    f.begin();
};

exports.passthruEvent = function (test) {
    f = new FakeReader();
    var gotError = false,
        errorCallback = function (data) {
            test.equal(data, "test");
            gotError = true;
        };
    s = new DelimiterStream(f, "\n", "utf8");
    s.on('error', errorCallback);
    test.equal(events.EventEmitter.listenerCount(f, 'error'), 1);
    f.emit('error', "test");
    s.removeListener('error', errorCallback);
    test.equal(events.EventEmitter.listenerCount(f, 'error'), 0);
    test.ok(gotError);
    test.done();
};

exports.passthruRemoveAllListeners = function (test) {
    f = new FakeReader();
    var gotError = false,
        errorCallback = function (data) {
            test.equal(data, "test");
            gotError = true;
        };
    s = new DelimiterStream(f, "\n", "utf8");
    s.on('error', errorCallback);
    test.equal(events.EventEmitter.listenerCount(f, 'error'), 1);
    f.emit('error', "test");
    s.removeAllListeners('error');
    test.equal(events.EventEmitter.listenerCount(f, 'error'), 0);
    test.ok(gotError);
    test.done();
};

exports.passthruRemoveAllAllListeners = function (test) {
    f = new FakeReader();
    var gotError = false,
        errorCallback = function (data) {
            test.equal(data, "test");
            gotError = true;
        };
    s = new DelimiterStream(f, "\n", "utf8");
    s.on('error', errorCallback);
    test.equal(events.EventEmitter.listenerCount(f, 'error'), 1);
    f.emit('error', "test");
    s.removeAllListeners();
    test.equal(events.EventEmitter.listenerCount(f, 'error'), 0);
    test.ok(gotError);
    test.done();
};

exports.stringOneMatchPassthru = function (test) {
    f = new FakeReader('utf8');
    s = new DelimiterStream(f, "\n", "utf8");
    s.write("\n", 275); //"\n"

    s.on('data', function (data) {
        test.equal(data.length, 275);
        gotData = true;
    });
    s.resume();

    var gotData = false;
    f.on('done', function (isOld) {
        test.equal(isOld, false); //sanity check
        test.ok(gotData);
        test.done();
    });

    f.begin();
};

exports.defaultArgs = function (test) {
    f = new FakeReader();
    s = new DelimiterStream(f);
    s.write(10, 275); //"\n"

    s.on('data', function (data) {
        test.equal(data.length, 275);
        gotData = true;
    });
    s.resume();

    var gotData = false;
    f.on('done', function (isOld) {
        test.equal(isOld, false); //sanity check
        test.ok(gotData);
        test.done();
    });

    f.begin();
};

exports.passthruClose = function (test) {
    f = new FakeReader();
    var gotError = false,
        closeCallback = function (data, data2) {
            test.equal(data, "test");
            test.equal(data2, "test2");
            gotError = true;
        };
    s = new DelimiterStream(f, "\n", "utf8");
    s.on('close', closeCallback);
    test.equal(events.EventEmitter.listenerCount(f, 'close'), 1);
    f.emit('close', "test", "test2");
    s.removeListener('error', closeCallback);
    test.equal(events.EventEmitter.listenerCount(f, 'close'), 0);
    test.equal(events.EventEmitter.listenerCount(f, 'readable'), 0);
    //we're no longer removing the self event listners by default
    test.equal(events.EventEmitter.listenerCount(s, 'close'), 1);
    test.equal(s.readableStream, null);
    test.ok(gotError);
    test.done();
};

exports.invalidEncodingThrows = function (test) {
    var gotError = false;
    f = new FakeReader();
    f.setEncoding('hex');
    try {
        s = new DelimiterStream(f, "\n", 'utf8');
    } catch (e) {
        if (e instanceof Error && e.message.indexOf('DelimiterStream was setup') === 0) {
            gotError = true;
        }
    }
    test.ok(gotError);
    test.done();
};

exports.setEncodingPassedIn = function (test) {
    f = new FakeReader();
    s = new DelimiterStream(f, "\n", 'utf8');
    test.equal('utf8', f._readableState.encoding);
    test.done();
};

exports.setEncodingPassedInBinary = function (test) {
    f = new FakeReader();
    s = new DelimiterStream(f, "\n");
    test.equal(null, f._readableState.encoding);
    test.done();
};

exports.destroyTwice = function (test) {
    f = new FakeReader();
    s = new DelimiterStream(f, "\n");
    s.destroy();
    s.destroy();
    test.done();
};

exports.writeAfterDestroy = function (test) {
    f = new FakeReader();
    s = new DelimiterStream(f, "\n");
    s.destroy();
    s.on('error', function() {
        test.done();
    });
    s.write();
};

exports.matchBackToBack = function(test) {
    var matchIndexes = [11,12,13],
        chunkID = 0,
        actualChunks = 1; //we're ignoring the matches back to back

    var oldStream = !!test.__oldStyle;
    if (oldStream) {
        f = new FakeOldReader();
    } else {
        f = new FakeReader();
    }
    matchIndexes.forEach(function(m) {
        f.write(10, m); //"\n"
    });

    f.on('done', function(isOld) {
        test.equal(isOld, oldStream); //sanity check
        test.equal(actualChunks, chunkID);
        test.done();
    });

    s = new DelimiterStream(f, 10, "binary", oldStream);
    var lastMatchIndex = 0,
        currentMatchIndex;
    s.on('data', function(data) {
        currentMatchIndex = matchIndexes[chunkID];
        test.equal(data.length, currentMatchIndex - lastMatchIndex);
        lastMatchIndex = currentMatchIndex + 1;
        chunkID++;
    });
    s.resume();
    f.begin();
};
exports.matchBackToBackOld = function(test) {
    test.__oldStyle = true;
    exports.matchBackToBack(test);
};


exports.dataInData = function(test) {
    var matchIndexes = [4, 9, 19],
        f = new FakeReader(null, 20, 5),
        chunkID = 0,
        actualChunks = 3; //we're ignoring the matches back to back

    f.write(10, 4);
    f.write(10, 9);

    f.on('done', function() {
        test.equal(actualChunks, chunkID);
        test.done();
    });

    s = new DelimiterStream(f);
    var lastMatchIndex = 0,
        currentMatchIndex;
    s.on('data', function(data) {
        currentMatchIndex = matchIndexes[chunkID];
        test.equal(data.length, currentMatchIndex - lastMatchIndex);
        lastMatchIndex = currentMatchIndex + 1;
        //now force DelimiterStream to start reading the next chunk
        if (chunkID === 1) {
            f.write(10, 19);
            //now ghetto force a read
            s._readableCallback();
        }
        chunkID++;
    });
    s.resume();
    f.begin();
};
