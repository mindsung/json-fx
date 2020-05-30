{
    @intersect($obj, $keys): {
        $filterKeys: $keys:filter($k => $obj[$k] != undefined),
        [$filterKeys as $k]: $obj[$k]
    },

    $A: {'foo': 10, 'bar': 20},
    a: @intersect($A, ['foo', 'bar', 'baz'])
}
